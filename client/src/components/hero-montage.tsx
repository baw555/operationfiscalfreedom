import { useState, useEffect, useRef, useCallback } from "react";
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
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const advancingRef = useRef(false);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasPlayedRef = useRef(false);

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const advanceToNext = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    
    clearFallbackTimer();
    setActiveIndex(prev => (prev + 1) % montageVideos.length);
    
    setTimeout(() => {
      advancingRef.current = false;
    }, 500);
  }, [clearFallbackTimer]);

  const attemptPlay = useCallback((video: HTMLVideoElement) => {
    video.currentTime = 0;
    const playPromise = video.play();
    
    if (playPromise) {
      playPromise.then(() => {
        hasPlayedRef.current = true;
        setNeedsInteraction(false);
        
        clearFallbackTimer();
        const duration = video.duration || 10;
        fallbackTimerRef.current = setTimeout(advanceToNext, (duration + 1) * 1000);
      }).catch(() => {
        if (!hasPlayedRef.current) {
          setNeedsInteraction(true);
        }
        clearFallbackTimer();
        fallbackTimerRef.current = setTimeout(advanceToNext, 8000);
      });
    }
  }, [advanceToNext, clearFallbackTimer]);

  const handleTapToPlay = useCallback(() => {
    setNeedsInteraction(false);
    hasPlayedRef.current = true;
    
    const currentVideo = videoRefs.current[activeIndex];
    if (currentVideo) {
      attemptPlay(currentVideo);
    }
  }, [activeIndex, attemptPlay]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex) {
          attemptPlay(video);
        } else {
          video.pause();
        }
      }
    });

    return () => {
      clearFallbackTimer();
    };
  }, [activeIndex, attemptPlay, clearFallbackTimer]);

  useEffect(() => {
    const currentVideo = videoRefs.current[activeIndex];
    if (!currentVideo) return;
    
    const handleEnded = () => advanceToNext();
    
    const handleTimeUpdate = () => {
      if (currentVideo.duration > 0 && currentVideo.currentTime >= currentVideo.duration - 0.3) {
        advanceToNext();
      }
    };

    const handleLoadedMetadata = () => {
      if (currentVideo.duration > 0) {
        clearFallbackTimer();
        fallbackTimerRef.current = setTimeout(advanceToNext, (currentVideo.duration + 1) * 1000);
      }
    };

    currentVideo.addEventListener("ended", handleEnded);
    currentVideo.addEventListener("timeupdate", handleTimeUpdate);
    currentVideo.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      currentVideo.removeEventListener("ended", handleEnded);
      currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
      currentVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [activeIndex, advanceToNext, clearFallbackTimer]);

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
      
      {needsInteraction && (
        <button
          onClick={handleTapToPlay}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 cursor-pointer"
          data-testid="montage-tap-to-play"
        >
          <div className="bg-brand-navy/80 text-white px-6 py-3 rounded-lg border-2 border-brand-gold font-semibold">
            Tap to Start Video
          </div>
        </button>
      )}
      
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
