import { getAccessToken } from './firebaseAuth';

export interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
}

// Convert string to base64url standard required by Gmail API
function createRawEmail(to: string, subject: string, body: string): string {
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    body,
  ];

  const email = emailLines.join('\r\n');

  return btoa(
    encodeURIComponent(email).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function sendEmailViaGmail({
  to,
  subject,
  body,
}: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const token = getAccessToken();
  if (!token) {
    return { success: false, error: 'Gmail access token missing. Please sign in with Google first.' };
  }

  try {
    const raw = createRawEmail(to, subject, body);
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gmail API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Failed to send email via Gmail:', err);
    return { success: false, error: err.message || 'An unexpected error occurred while sending email.' };
  }
}

export async function createDraftViaGmail({
  to,
  subject,
  body,
}: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const token = getAccessToken();
  if (!token) {
    return { success: false, error: 'Gmail access token missing. Please sign in with Google first.' };
  }

  try {
    const raw = createRawEmail(to, subject, body);
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: { raw },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gmail API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Failed to create draft via Gmail:', err);
    return { success: false, error: err.message || 'An unexpected error occurred while creating draft.' };
  }
}
