import { useEffect } from "react";
import { useLocation } from "wouter";

export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
}

export function ScrollToTop() {
  useScrollToTop();
  return null;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

export function useScrollToTopOnChange(dependency: boolean) {
  useEffect(() => {
    if (dependency) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [dependency]);
}
