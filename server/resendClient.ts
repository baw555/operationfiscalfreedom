import { Resend } from 'resend';

export async function getResendClient(): Promise<{ client: Resend; fromEmail: string }> {
  console.log("[Resend] Getting fresh Resend client...");

  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    console.log(`[Resend] Using direct API key with from_email: ${process.env.RESEND_FROM_EMAIL}`);
    return {
      client: new Resend(process.env.RESEND_API_KEY),
      fromEmail: process.env.RESEND_FROM_EMAIL,
    };
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    console.error("[Resend] ERROR: No RESEND_API_KEY env var and no Replit connector token found");
    throw new Error('Resend not available: set RESEND_API_KEY and RESEND_FROM_EMAIL, or run on Replit with the Resend integration');
  }

  if (!hostname) {
    console.error("[Resend] ERROR: REPLIT_CONNECTORS_HOSTNAME not set");
    throw new Error('Resend integration not available: connector hostname not configured');
  }

  console.log("[Resend] Fetching connection settings from Replit connector...");
  const baseUrl = hostname.startsWith('http') ? hostname : 'https://' + hostname;
  const response = await fetch(
    baseUrl + '/api/v2/connection?include_secrets=true&connector_names=resend',
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
    console.error("[Resend] ERROR: No connection settings returned");
    throw new Error('Resend not connected - please configure the Resend integration');
  }

  if (!connectionSettings.settings?.api_key) {
    console.error("[Resend] ERROR: API key not found in connection settings");
    throw new Error('Resend API key not configured');
  }

  const apiKey = connectionSettings.settings.api_key;
  const fromEmail = connectionSettings.settings.from_email;

  if (!fromEmail) {
    console.error("[Resend] ERROR: from_email not configured");
    throw new Error('Resend from_email not configured');
  }

  console.log(`[Resend] Successfully configured with from_email: ${fromEmail}`);

  return {
    client: new Resend(apiKey),
    fromEmail
  };
}
