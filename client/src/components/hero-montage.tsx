import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const montageVideos = [
  "/videos/montage-iwojima.mp4",
  "/videos/soldiers-marching-new.mp4",
  "/videos/montage-embrace-1.mp4",
  "/videos/montage-salute.mp4",
  "/videos/montage-embrace-2.mp4",
  "/videos/montage-rain.mp4",
  "/videos/montage-gear.mp4",
  "/videos/montage-helicopter.mp4",
  "/videos/montage-clip.mp4",
];

export function HeroMontage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Play active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [activeIndex]);

  // Listen for video end to advance to next
  useEffect(() => {
    const currentVideo = videoRefs.current[activeIndex];
    
    const handleEnded = () => {
      setActiveIndex(prev => (prev + 1) % montageVideos.length);
    };

    if (currentVideo) {
      currentVideo.addEventListener("ended", handleEnded);
    }

    return () => {
      if (currentVideo) {
        currentVideo.removeEventListener("ended", handleEnded);
      }
    };
  }, [activeIndex]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy">
      {montageVideos.map((src, index) => (
        <video
          key={src}
          ref={el => { videoRefs.current[index] = el; }}
          src={src}
          muted
          playsInline
          preload="auto"
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out",
            index === activeIndex ? "opacity-100" : "opacity-0"
          )}
          style={{ zIndex: index === activeIndex ? 1 : 0 }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-brand-navy/30 z-10" />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
        {montageVideos.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500",
              index === activeIndex 
                ? "bg-brand-gold w-4 sm:w-6" 
                : "bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
