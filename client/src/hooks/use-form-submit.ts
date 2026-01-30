import { useState, useCallback } from "react";

export function useFormSubmit<T = void>(
  onSubmit: (data?: T) => Promise<void> | void,
  options?: {
    preventDoubleClick?: boolean;
    resetDelay?: number;
  }
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data?: T) => {
      if (isSubmitting && options?.preventDoubleClick !== false) {
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        await onSubmit(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      } finally {
        if (options?.resetDelay) {
          setTimeout(() => setIsSubmitting(false), options.resetDelay);
        } else {
          setIsSubmitting(false);
        }
      }
    },
    [onSubmit, isSubmitting, options]
  );

  return {
    isSubmitting,
    error,
    handleSubmit,
    setError,
  };
}
