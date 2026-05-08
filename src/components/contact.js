function createStatusMessage() {
  const message = document.createElement('p');
  message.className = 'form-message';
  message.setAttribute('role', 'status');
  message.setAttribute('aria-live', 'polite');
  message.hidden = true;
  return message;
}

function createField(field) {
  const label = document.createElement('label');
  label.htmlFor = field.name;

  const labelText = document.createElement('span');
  labelText.className = 'label-text';
  labelText.textContent = field.label;
  label.append(labelText);

  let input;
  if (field.type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 4;
  } else {
    input = document.createElement('input');
    input.type = field.type || 'text';
  }

  input.id = field.name;
  input.name = field.name;
  input.autocomplete = field.autocomplete || 'off';
  input.required = Boolean(field.required);
  input.className = 'form-field';

  if (field.placeholder) {
    input.placeholder = field.placeholder;
  }

  label.append(input);
  return { label, input };
}

function createHoneypotField() {
  const wrapper = document.createElement('label');
  wrapper.className = 'sr-only';
  wrapper.setAttribute('aria-hidden', 'true');

  const labelText = document.createElement('span');
  labelText.className = 'label-text';
  labelText.textContent = 'Website';
  wrapper.append(labelText);

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'website';
  input.id = 'website';
  input.tabIndex = -1;
  input.autocomplete = 'off';
  input.className = 'form-field';
  wrapper.append(input);

  return wrapper;
}

export function createContactSection(content) {
  const section = document.createElement('section');
  section.id = 'share';
  section.className = 'section section-alt';
  section.setAttribute('aria-labelledby', 'share-title');

  const heading = document.createElement('h2');
  heading.id = 'share-title';
  heading.textContent = content.contact.heading;

  const description = document.createElement('p');
  description.textContent = content.contact.description;

  const form = document.createElement('form');
  form.className = 'contact-form';
  form.noValidate = true;
  form.setAttribute('autocomplete', 'on');
  form.setAttribute('aria-describedby', 'share-status');

  const fieldWrap = document.createElement('div');
  fieldWrap.className = 'form-fields';

  content.contact.fields.forEach((field) => {
    const { label } = createField(field);
    fieldWrap.appendChild(label);
  });

  fieldWrap.appendChild(createHoneypotField());

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'btn';
  button.textContent = content.contact.buttonText;
  button.setAttribute('aria-label', 'Submit your community share contribution');

  const message = createStatusMessage();
  message.id = 'share-status';
  message.textContent = '';
  form.append(fieldWrap, button, message);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.hidden = false;
    message.textContent = '';
    button.disabled = true;
    button.textContent = 'Sending...';

    const payload = Object.fromEntries(new FormData(form).entries());
    if (payload.website && payload.website.trim()) {
      message.className = 'form-message form-error';
      message.textContent = 'Submission rejected as potential spam.';
      button.disabled = false;
      button.textContent = content.contact.buttonText;
      return;
    }

    const missing = [];
    if (!payload.name || !payload.name.trim()) {
      missing.push('name');
    }
    if (!payload.email || !payload.email.trim()) {
      missing.push('email');
    }
    if (!payload.focus || !payload.focus.trim()) {
      missing.push('focus');
    }
    if (!payload.message || !payload.message.trim()) {
      missing.push('message');
    }

    if (missing.length) {
      message.textContent = `Please complete: ${missing.join(', ')}`;
      message.className = 'form-message form-error';
      message.classList.remove('form-success');
      button.disabled = false;
      button.textContent = content.contact.buttonText;
      return;
    }

    try {
      const response = await fetch(content.contact.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const payloadData = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payloadData.error || 'Submission failed.');
      }

      const moderationStatus =
        payloadData.status === 'pending_review'
          ? ' Your submission is queued for review before being posted.'
          : ' Thanks for sharing!';

      const moderationReason =
        payloadData.moderation?.flags?.length
          ? ` We flagged this as: ${payloadData.moderation.flags.join(', ')}`
          : '';

      message.className = 'form-message form-success';
      message.textContent = `Submission accepted.${moderationStatus}${moderationReason}`.trim();
      button.disabled = false;
      button.textContent = 'Submit another insight';
      form.reset();
    } catch (error) {
      message.className = 'form-message form-error';
      message.textContent = error.message || 'Could not send your submission. Please try again.';
      button.textContent = content.contact.buttonText;
      button.disabled = false;
      return;
    }
  });

  section.append(heading, description, form);
  return section;
}
