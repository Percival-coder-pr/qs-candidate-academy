function createEventCard(event) {
  const article = document.createElement('article');
  article.className = 'card';

  const title = document.createElement('h3');
  title.textContent = event.title;

  const date = document.createElement('p');
  date.className = 'event-date';
  date.textContent = event.date;

  const detail = document.createElement('p');
  detail.textContent = event.detail;

  article.append(title, date, detail);
  return article;
}

export function createEventsListSection(content) {
  const section = document.createElement('section');
  section.id = 'events-list';
  section.className = 'section';
  section.setAttribute('aria-label', 'Community sessions');

  const heading = document.createElement('h2');
  heading.textContent = content.events.heading;

  const intro = document.createElement('p');
  intro.textContent = 'Join scheduled sessions to discuss real recruiting rounds and improve with peers.';

  const list = document.createElement('div');
  list.className = 'card-grid';
  content.events.list.forEach((event) => {
    list.appendChild(createEventCard(event));
  });

  section.append(heading, intro, list);
  return section;
}
