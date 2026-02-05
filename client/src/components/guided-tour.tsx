import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Anchor, Target } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface GuidedTourProps {
  tourId: string;
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
}

export function GuidedTour({ tourId, steps, onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const updateTargetPosition = useCallback(() => {
    if (!isActive || currentStep >= steps.length) return;
    const step = steps[currentStep];
    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive, currentStep, steps]);

  useEffect(() => {
    const completed = localStorage.getItem(`tour_${tourId}_completed`);
    if (!completed) {
      const timer = setTimeout(() => setIsActive(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [tourId]);

  useEffect(() => {
    updateTargetPosition();
    window.addEventListener("resize", updateTargetPosition);
    window.addEventListener("scroll", updateTargetPosition);
    return () => {
      window.removeEventListener("resize", updateTargetPosition);
      window.removeEventListener("scroll", updateTargetPosition);
    };
  }, [updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`tour_${tourId}_completed`, "true");
    setIsActive(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(`tour_${tourId}_completed`, "true");
    setIsActive(false);
    onSkip?.();
  };

  if (!isActive || steps.length === 0) return null;

  const step = steps[currentStep];
  const getTooltipPosition = () => {
    if (!targetRect) return { top: "50%", left: "50%" };
    const pos = step.position || "bottom";
    const padding = 16;
    const tooltipWidth = 320;
    const tooltipHeight = 160;

    switch (pos) {
      case "top":
        return {
          top: `${targetRect.top - tooltipHeight - padding}px`,
          left: `${Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, targetRect.left + targetRect.width / 2 - tooltipWidth / 2))}px`
        };
      case "bottom":
        return {
          top: `${targetRect.bottom + padding}px`,
          left: `${Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, targetRect.left + targetRect.width / 2 - tooltipWidth / 2))}px`
        };
      case "left":
        return {
          top: `${targetRect.top + targetRect.height / 2 - tooltipHeight / 2}px`,
          left: `${targetRect.left - tooltipWidth - padding}px`
        };
      case "right":
        return {
          top: `${targetRect.top + targetRect.height / 2 - tooltipHeight / 2}px`,
          left: `${targetRect.right + padding}px`
        };
      default:
        return {
          top: `${targetRect.bottom + padding}px`,
          left: `${targetRect.left}px`
        };
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9998] pointer-events-none" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        {targetRect && (
          <div
            className="absolute transition-all duration-300"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
              borderRadius: "8px",
              border: "3px solid #E21C3D",
              background: "transparent"
            }}
          />
        )}
      </div>

      <div
        className="fixed z-[9999] w-80 bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-up border-4 border-[#1A365D]"
        style={getTooltipPosition()}
        data-testid="tour-tooltip"
      >
        <div className="bg-gradient-to-r from-[#1A365D] to-[#0D2847] text-white px-4 py-3 flex items-center gap-2">
          <Anchor className="w-5 h-5 text-[#E21C3D]" />
          <span className="font-bold flex-1" style={{ fontFamily: 'Impact, sans-serif' }}>
            {step.title}
          </span>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            data-testid="tour-skip"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {step.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentStep ? "bg-[#E21C3D]" : "bg-gray-300"}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  data-testid="tour-prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-1.5 bg-[#E21C3D] text-white text-sm font-bold rounded-full hover:bg-[#B91C1C] transition-colors"
                data-testid="tour-next"
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </>
  );
}

export function useTour(tourId: string) {
  const [isCompleted, setIsCompleted] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem(`tour_${tourId}_completed`);
    setIsCompleted(completed === "true");
  }, [tourId]);

  const resetTour = () => {
    localStorage.removeItem(`tour_${tourId}_completed`);
    setIsCompleted(false);
    window.location.reload();
  };

  return { isCompleted, resetTour };
}

export const homeTourSteps: TourStep[] = [
  {
    target: '[data-testid="hero-section"]',
    title: "Welcome to NavigatorUSA!",
    content: "We help veteran families access benefits, resources, and support. Let me show you around!",
    position: "bottom"
  },
  {
    target: '[data-testid="services-section"]',
    title: "Our Services",
    content: "Explore VA claims assistance, tax credits, grants, and more services designed for veterans.",
    position: "top"
  },
  {
    target: '[data-testid="facer-c-bot"]',
    title: "Meet Sailor Man!",
    content: "Click on Sailor Man anytime to ask questions about VA claims, benefits, and get instant help!",
    position: "left"
  }
];

export const claimsTourSteps: TourStep[] = [
  {
    target: '[data-testid="claim-wizard"]',
    title: "VA Claims Wizard",
    content: "Our step-by-step wizard helps you organize your claim with confidence.",
    position: "bottom"
  },
  {
    target: '[data-testid="evidence-tracker"]',
    title: "Evidence Tracker",
    content: "Keep track of all your supporting documents and see strength analysis.",
    position: "right"
  },
  {
    target: '[data-testid="vendor-scorecards"]',
    title: "Vendor Scorecards",
    content: "Compare service providers to find the best help for your specific needs.",
    position: "left"
  }
];
