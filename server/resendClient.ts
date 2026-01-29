import { Resend } from 'resend';

// WARNING: Never cache the Resend client.
// Access tokens expire, so a new client must be created each time.
// Always call getResendClient() to get a fresh client per request.

export async function getResendClient(): Promise<{ client: Resend; fromEmail: string }> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('Resend integration not available: X_REPLIT_TOKEN not found');
  }

  if (!hostname) {
    throw new Error('Resend integration not available: REPLIT_CONNECTORS_HOSTNAME not set');
  }

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Resend connector request failed: ${response.status}`);
  }

  const data = await response.json();
  const connectionSettings = data.items?.[0];

  if (!connectionSettings || !connectionSettings.settings?.api_key) {
    throw new Error('Resend not connected - please configure the Resend integration');
  }

  const apiKey = connectionSettings.settings.api_key;
  const fromEmail = connectionSettings.settings.from_email;

  if (!fromEmail) {
    throw new Error('Resend from_email not configured - please set a verified sender email in the integration');
  }

  // Create a fresh client for each request (never cache)
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}
