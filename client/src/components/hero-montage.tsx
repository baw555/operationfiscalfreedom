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

const SLIDE_DURATION = 3000; // 3 seconds display time

export function HeroMontage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Start first video
    const firstVideo = videoRefs.current[0];
    if (firstVideo) {
      firstVideo.currentTime = 0;
      firstVideo.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Preload next video
      const next = (currentIndex + 1) % montageVideos.length;
      const nextVideo = videoRefs.current[next];
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {});
      }
      
      setTimeout(() => {
        setCurrentIndex(next);
        setNextIndex((next + 1) % montageVideos.length);
        setIsTransitioning(false);
      }, 600); // Crossfade duration
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {montageVideos.map((video, index) => {
        const isActive = index === currentIndex;
        const isNext = index === nextIndex;
        
        return (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-600 ease-in-out",
              isActive ? "opacity-100" : "opacity-0",
              isTransitioning && isNext ? "opacity-100" : ""
            )}
            style={{
              zIndex: isActive ? 2 : isNext ? 1 : 0,
            }}
          >
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src={video.src}
              muted
              playsInline
              loop
              preload="auto"
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
