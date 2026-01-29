import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const montageVideos = [
  { src: "/videos/soldiers-marching-new.mp4", alt: "Soldiers marching in formation" },
  { src: "/videos/montage-salute.mp4", alt: "Navy rifle salute at sunset" },
  { src: "/videos/montage-rain.mp4", alt: "Marines marching in rain" },
  { src: "/videos/montage-gear.mp4", alt: "Military gear staging" },
  { src: "/videos/montage-patrol.mp4", alt: "Marines mountain patrol" },
  { src: "/videos/montage-helicopter.mp4", alt: "Soldiers in helicopter" },
  { src: "/videos/montage-clip.mp4", alt: "Military action clip" },
];

const SLIDE_DURATION = 3000;

export function HeroMontage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % montageVideos.length);
        setIsTransitioning(false);
      }, 600);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const videoEl = videoRefs.current[currentIndex];
    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {});
    }
  }, [currentIndex]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {montageVideos.map((video, index) => {
        const isActive = index === currentIndex;
        const isPrev = index === (currentIndex - 1 + montageVideos.length) % montageVideos.length;
        
        return (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              isActive && !isTransitioning ? "opacity-100" : "",
              isActive && isTransitioning ? "opacity-0" : "",
              !isActive && isPrev && isTransitioning ? "opacity-100" : "",
              !isActive && !isPrev ? "opacity-0" : ""
            )}
            style={{
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
            }}
          >
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src={video.src}
              muted
              playsInline
              loop={false}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
      
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-brand-navy/30 z-10" />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {montageVideos.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-500",
              index === currentIndex 
                ? "bg-brand-gold w-6" 
                : "bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
