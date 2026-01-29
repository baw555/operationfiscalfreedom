import { useState, useEffect, useRef, useCallback } from "react";
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

const DISPLAY_MS = 3000; // 3 seconds visible display time
const FADE_MS = 600; // 600ms crossfade transition
const CYCLE_MS = DISPLAY_MS + FADE_MS; // Total cycle time

export function HeroMontage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getNextIndex = useCallback((index: number) => {
    return (index + 1) % montageVideos.length;
  }, []);

  const playVideo = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, []);

  const pauseVideo = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
    }
  }, []);

  const preloadVideo = useCallback((index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.load();
    }
  }, []);

  // Start first video and begin cycle
  useEffect(() => {
    playVideo(0);
    // Preload next video
    preloadVideo(1);

    const runCycle = () => {
      // Start transition (fade out current, fade in next)
      setIsTransitioning(true);
      
      const nextIdx = getNextIndex(currentIndex);
      playVideo(nextIdx);

      // After fade completes, update state
      setTimeout(() => {
        pauseVideo(currentIndex);
        setCurrentIndex(nextIdx);
        setIsTransitioning(false);
        
        // Preload the video after next
        preloadVideo(getNextIndex(nextIdx));
      }, FADE_MS);
    };

    // Schedule next transition after display time
    timeoutRef.current = setTimeout(runCycle, DISPLAY_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, getNextIndex, playVideo, pauseVideo, preloadVideo]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {montageVideos.map((video, index) => {
        const isActive = index === currentIndex;
        const isNext = index === getNextIndex(currentIndex);
        
        return (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity ease-in-out",
              isActive && !isTransitioning ? "opacity-100" : "",
              isActive && isTransitioning ? "opacity-0" : "",
              !isActive && isNext && isTransitioning ? "opacity-100" : "",
              !isActive && !isNext ? "opacity-0" : ""
            )}
            style={{
              zIndex: isActive ? 2 : isNext ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
            }}
          >
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src={video.src}
              muted
              playsInline
              preload="metadata"
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
