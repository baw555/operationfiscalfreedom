import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const montageVideos = [
  { src: "/videos/montage-iwojima.mp4", alt: "Iwo Jima flag raising" },
  { src: "/videos/soldiers-marching-new.mp4", alt: "Soldiers marching in formation" },
  { src: "/videos/montage-reunion.mp4", alt: "Military homecoming reunion" },
  { src: "/videos/montage-salute.mp4", alt: "Navy rifle salute at sunset" },
  { src: "/videos/montage-embrace.mp4", alt: "Soldiers emotional embrace" },
  { src: "/videos/montage-rain.mp4", alt: "Marines marching in rain" },
  { src: "/videos/montage-gear.mp4", alt: "Military gear staging" },
  { src: "/videos/montage-patrol.mp4", alt: "Marines mountain patrol" },
  { src: "/videos/montage-helicopter.mp4", alt: "Soldiers in helicopter" },
  { src: "/videos/montage-clip.mp4", alt: "Military action clip" },
];

export function HeroMontage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);

  // Play current video on mount and when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  // Timer for transitions - runs once on mount
  useEffect(() => {
    const timer = setInterval(() => {
      // Start fade out
      setOpacity(0);
      
      // After fade, switch video
      setTimeout(() => {
        setActiveIndex(prev => (prev + 1) % montageVideos.length);
        setOpacity(1);
      }, 500);
    }, 5500); // 5 seconds display + 500ms for transition

    return () => clearInterval(timer);
  }, []);

  const nextIndex = (activeIndex + 1) % montageVideos.length;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy">
      {/* Next video (underneath) */}
      <video
        ref={nextVideoRef}
        src={montageVideos[nextIndex].src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Current video (on top with fade) */}
      <video
        ref={videoRef}
        src={montageVideos[activeIndex].src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-brand-navy/30 z-10" />
      
      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {montageVideos.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-500",
              index === activeIndex 
                ? "bg-brand-gold w-6" 
                : "bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
