export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

// Redirect to login with a toast notification
export function redirectToLogin(toast?: (options: { title: string; description: string; variant: string }) => void) {
  if (toast) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
  }
  setTimeout(() => {
    // Store current path so user returns here after login
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/api/login?returnTo=${returnTo}`;
  }, 500);
}
