import { getTrustedFormCertUrl } from "@/hooks/use-trustedform";

interface ConsentLogData {
  submissionType: string;
  submissionId: number;
  name: string;
  email: string;
  phone?: string;
  partnersSharedWith?: string[];
}

export async function logConsent(data: ConsentLogData): Promise<boolean> {
  try {
    const trustedFormCertUrl = getTrustedFormCertUrl() || undefined;
    const landingPageUrl = window.location.href;
    
    const response = await fetch('/api/consent-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionType: data.submissionType,
        submissionId: data.submissionId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        consentCheckbox: true,
        trustedFormCertUrl,
        landingPageUrl,
        partnersSharedWith: data.partnersSharedWith ? JSON.stringify(data.partnersSharedWith) : undefined,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to log consent:', error);
    return false;
  }
}
