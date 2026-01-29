import { Resend } from 'resend';

// WARNING: Never cache the Resend client.
// Access tokens expire, so a new client must be created each time.
// Always call getResendClient() to get a fresh client per request.

export async function getResendClient(): Promise<{ client: Resend; fromEmail: string }> {
  console.log("[Resend] Getting fresh Resend client...");
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    console.error("[Resend] ERROR: X_REPLIT_TOKEN not found");
    throw new Error('Resend integration not available: authentication token not found');
  }

  if (!hostname) {
    console.error("[Resend] ERROR: REPLIT_CONNECTORS_HOSTNAME not set");
    throw new Error('Resend integration not available: connector hostname not configured');
  }

  console.log("[Resend] Fetching connection settings from connector...");
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
    console.error(`[Resend] ERROR: Connector request failed with status ${response.status}`);
    throw new Error(`Resend connector request failed: ${response.status}`);
  }

  const data = await response.json();
  const connectionSettings = data.items?.[0];

  if (!connectionSettings) {
    console.error("[Resend] ERROR: No connection settings returned - Resend integration not configured");
    throw new Error('Resend not connected - please configure the Resend integration in the Replit Secrets panel');
  }

  if (!connectionSettings.settings?.api_key) {
    console.error("[Resend] ERROR: API key not found in connection settings");
    throw new Error('Resend API key not configured');
  }

  const apiKey = connectionSettings.settings.api_key;
  const fromEmail = connectionSettings.settings.from_email;

  if (!fromEmail) {
    console.error("[Resend] ERROR: from_email not configured in Resend integration");
    throw new Error('Resend from_email not configured - please set a verified sender email in the integration settings');
  }

  console.log(`[Resend] Successfully configured with from_email: ${fromEmail}`);

  // Create a fresh client for each request (never cache)
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}
