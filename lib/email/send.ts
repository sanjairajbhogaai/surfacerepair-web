type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER ?? 'console';

  if (provider === 'console') {
    console.log('\n=== Email ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('---');
    console.log(text);
    console.log('=============\n');
    return true;
  }

  if (provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY missing');
      return false;
    }
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? 'SurfaceRepair <no-reply@surfacerepair.in>',
          to: [to],
          subject,
          html,
          text,
        }),
      });
      if (!res.ok) {
        console.error('Resend error:', res.status);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Resend network error:', e);
      return false;
    }
  }

  console.error('Unknown EMAIL_PROVIDER:', provider);
  return false;
}
