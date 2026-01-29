import { useEffect, useState } from 'react';

declare global {
  interface Window {
    TrustedForm?: {
      certUrl?: string;
    };
  }
}

export function useTrustedForm() {
  const [certUrl, setCertUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkForCertUrl = () => {
      const input = document.querySelector<HTMLInputElement>('input[name="xxTrustedFormCertUrl"]');
      if (input && input.value) {
        setCertUrl(input.value);
        return true;
      }
      if (window.TrustedForm?.certUrl) {
        setCertUrl(window.TrustedForm.certUrl);
        return true;
      }
      return false;
    };

    if (checkForCertUrl()) return;

    const interval = setInterval(() => {
      if (checkForCertUrl()) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return certUrl;
}

export function getTrustedFormCertUrl(): string | null {
  const input = document.querySelector<HTMLInputElement>('input[name="xxTrustedFormCertUrl"]');
  if (input && input.value) {
    return input.value;
  }
  if (window.TrustedForm?.certUrl) {
    return window.TrustedForm.certUrl;
  }
  return null;
}
