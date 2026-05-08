const COOLDOWN_MS = 45_000;
const MAX_NAME_LENGTH = 120;
const MAX_FOCUS_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_LINK_COUNT = 3;

const MODERATION_PATTERNS = [
  /\b(guaranteed|guarantee|click here|act now|crypto|lottery|lotto|earn|viagra|free\s+money|make\s+money)\b/i,
  /\b(visit\s+our\s+site|check\s+out\s+this\s+link)\b/i,
  /\b(increase\s+rank|boost\s+score|buy\s+followers|followers\s+for)\b/i,
];

const submissionHistoryByIp = new Map();
const submissionHistoryByEmail = new Map();

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Vary', 'Origin');
}

function sendJson(res, code, data) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function sanitize(value) {
  return String(value).replace(/[&<>"']/g, (match) => {
    switch (match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return match;
    }
  });
}

function normalizeText(value) {
  return sanitize(value ?? '').trim();
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      const payload = Buffer.concat(chunks).toString('utf8');
      if (!payload) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(payload));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function trimToLength(value, maxLength) {
  if (value.length > maxLength) {
    return `${value.slice(0, maxLength)}...`;
  }

  return value;
}

function pruneOldRecords(recordMap, now) {
  for (const [key, timestamp] of recordMap.entries()) {
    if (now - timestamp > COOLDOWN_MS * 2) {
      recordMap.delete(key);
    }
  }
}

function checkCooldown(map, key, now) {
  const value = map.get(key);
  if (!value) return true;

  return now - value >= COOLDOWN_MS;
}

function markSubmission(map, key, now) {
  map.set(key, now);
  pruneOldRecords(map, now);
}

function getClientId(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'anonymous';
}

function hasModerationFlags({ name, focus, message, email }) {
  const flags = [];

  const linkCount =
    (message.match(/https?:\/\/|www\./g) || []).length +
    (focus.match(/https?:\/\/|www\./g) || []).length;

  if (linkCount > MAX_LINK_COUNT) {
    flags.push('Too many links in submission.');
  }

  const fullText = `${name} ${focus} ${message} ${email}`;
  if (MODERATION_PATTERNS.some((pattern) => pattern.test(fullText))) {
    flags.push('Contains common spam patterns.');
  }

  const punctuationChars = (message.match(/[!@#$%^&*<>]/g) || []).length;
  if (punctuationChars > 20) {
    flags.push('Message contains excessive punctuation.');
  }

  const uniqueWords = new Set(
    message
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .filter(Boolean)
  );

  if (message.length > 200 && uniqueWords.size <= 4) {
    flags.push('Message has low word diversity.');
  }

  return {
    flags,
    requiresReview: flags.length > 0,
  };
}

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      ok: false,
      error: 'Method not allowed',
    });
  }

  let body = {};
  try {
    body = await parseBody(req);
  } catch (_error) {
    return sendJson(res, 400, {
      ok: false,
      error: 'Invalid JSON payload.',
    });
  }

  const name = normalizeText(body.name).slice(0, MAX_NAME_LENGTH);
  const email = normalizeText(body.email).toLowerCase();
  const focus = normalizeText(body.focus).slice(0, MAX_FOCUS_LENGTH);
  const message = normalizeText(body.message).slice(0, MAX_MESSAGE_LENGTH);
  const honeypot = normalizeText(body.website);

  if (honeypot) {
    return sendJson(res, 400, {
      ok: false,
      error: 'Submission blocked.',
    });
  }

  if (!name || !email || !focus || !message) {
    return sendJson(res, 400, {
      ok: false,
      error: 'Missing required fields.',
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return sendJson(res, 400, {
      ok: false,
      error: 'Please provide a valid email address.',
    });
  }

  const now = Date.now();
  const moderation = hasModerationFlags({
    name,
    focus,
    message,
    email,
  });

  const clientId = getClientId(req);
  if (!checkCooldown(submissionHistoryByIp, clientId, now)) {
    return sendJson(res, 429, {
      ok: false,
      error: 'You are submitting too frequently. Please wait before trying again.',
    });
  }

  if (!checkCooldown(submissionHistoryByEmail, email, now)) {
    return sendJson(res, 429, {
      ok: false,
      error: 'This email recently submitted a share. Please wait before trying again.',
    });
  }

  markSubmission(submissionHistoryByIp, clientId, now);
  markSubmission(submissionHistoryByEmail, email, now);

  const apiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;
  const resendTo = process.env.RESEND_TO;

  if (!apiKey || !resendFrom || !resendTo) {
    return sendJson(res, 503, {
      ok: false,
      error:
        'Email backend is not configured. Set RESEND_API_KEY, RESEND_FROM, and RESEND_TO in Vercel environment.',
    });
  }

  const safeMessage = message.replace(/\r?\n/g, '<br />');
  const normalizedName = trimToLength(name, MAX_NAME_LENGTH);
  const normalizedFocus = trimToLength(focus, MAX_FOCUS_LENGTH);
  const normalizedMessage = trimToLength(safeMessage, MAX_MESSAGE_LENGTH);
  const submissionId = `share-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [resendTo],
        subject: `${moderation.requiresReview ? '[Needs Review] ' : ''}Community submission from ${normalizedName}`,
        html: `
          <h3>New community share</h3>
          <p><strong>Name:</strong> ${normalizedName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Focus:</strong> ${normalizedFocus}</p>
          <p><strong>Moderation:</strong> ${moderation.requiresReview ? 'Needs review' : 'Passed'}</p>
          ${moderation.flags.length ? `<p><strong>Moderation flags:</strong> ${moderation.flags.join(', ')}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${normalizedMessage}</p>
          <p><strong>Submission ID:</strong> ${submissionId}</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const details = await emailResponse.text();
      return sendJson(res, 502, {
        ok: false,
        error: `Email service rejected request: ${details}`,
      });
    }
  } catch (error) {
    return sendJson(res, 502, {
      ok: false,
      error: error?.message || 'Unable to send email.',
    });
  }

  return sendJson(res, 200, {
    ok: true,
    message: 'Submission accepted.',
    status: moderation.requiresReview ? 'pending_review' : 'accepted',
    moderation,
    submissionId,
  });
}
