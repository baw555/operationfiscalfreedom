import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

const montageVideos = [
  "/videos/montage-clip.mp4",           // Soldiers shooting - first
  "/videos/soldiers-marching-new.mp4",
  "/videos/montage-rain.mp4",           // Rain video 1
  "/videos/montage-embrace-1.mp4",
  "/videos/montage-salute.mp4",
  "/videos/montage-gear.mp4",
  "/videos/montage-embrace-2.mp4",
  "/videos/montage-helicopter.mp4",
  "/videos/montage-iwojima.mp4",        // Iwo Jima - last
];

export function HeroMontage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const advancingRef = useRef(false);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);

  // Single timer management - clear any existing timer
  const clearDurationTimer = useCallback(() => {
    if (durationTimerRef.current) {
      clearTimeout(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  // Advance to next video - single entry point with debounce
  const advanceToNext = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    
    clearDurationTimer();
    setActiveIndex(prev => (prev + 1) % montageVideos.length);
    
    // Prevent double-advance for 800ms (longer than transition)
    setTimeout(() => {
      advancingRef.current = false;
    }, 800);
  }, [clearDurationTimer]);

  // Schedule advance based on actual video duration (only after canplay)
  const scheduleAdvance = useCallback((video: HTMLVideoElement) => {
    clearDurationTimer();
    const duration = video.duration;
    if (duration && duration > 0 && isFinite(duration)) {
      // Advance slightly before end to smooth transition
      const timeout = Math.max((duration - 0.5) * 1000, 1000);
      durationTimerRef.current = setTimeout(advanceToNext, timeout);
    }
  }, [advanceToNext, clearDurationTimer]);

  // Attempt to play video - handles mobile autoplay restrictions
  const attemptPlay = useCallback((video: HTMLVideoElement) => {
    video.currentTime = 0;
    const playPromise = video.play();
    
    if (playPromise) {
      playPromise.then(() => {
        userInteractedRef.current = true;
        setNeedsInteraction(false);
        setIsPlaying(true);
        
        // Only schedule timer after successful play AND we have duration
        if (video.duration && video.duration > 0) {
          scheduleAdvance(video);
        }
        // If no duration yet, loadedmetadata handler will schedule
      }).catch(() => {
        // Mobile autoplay blocked - DO NOT advance automatically
        // Wait for user interaction instead of cycling through videos
        setIsPlaying(false);
        if (!userInteractedRef.current) {
          setNeedsInteraction(true);
        }
        // Clear timer - don't advance on blocked autoplay
        clearDurationTimer();
      });
    }
  }, [scheduleAdvance, clearDurationTimer]);

  // User taps to enable video playback on mobile
  const handleTapToPlay = useCallback(() => {
    setNeedsInteraction(false);
    userInteractedRef.current = true;
    
    const currentVideo = videoRefs.current[activeIndex];
    if (currentVideo) {
      attemptPlay(currentVideo);
    }
  }, [activeIndex, attemptPlay]);

  // Effect: Handle video switching
  useEffect(() => {
    clearDurationTimer();
    
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex) {
          // Only auto-play if user has interacted or autoplay works
          if (userInteractedRef.current || !needsInteraction) {
            attemptPlay(video);
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });

    return () => {
      clearDurationTimer();
    };
  }, [activeIndex, attemptPlay, clearDurationTimer, needsInteraction]);

  // Effect: Video event listeners for current video
  useEffect(() => {
    const currentVideo = videoRefs.current[activeIndex];
    if (!currentVideo) return;
    
    // Primary advance trigger - video ended naturally
    const handleEnded = () => {
      advanceToNext();
    };
    
    // Backup trigger - advance just before end (handles edge cases)
    const handleTimeUpdate = () => {
      if (isPlaying && currentVideo.duration > 0 && 
          currentVideo.currentTime >= currentVideo.duration - 0.2) {
        advanceToNext();
      }
    };

    // When metadata loads, schedule timer if playing
    const handleLoadedMetadata = () => {
      if (isPlaying && currentVideo.duration > 0) {
        scheduleAdvance(currentVideo);
      }
    };
    
    // When video can play through, start if user has interacted
    const handleCanPlayThrough = () => {
      if (userInteractedRef.current && currentVideo.paused) {
        attemptPlay(currentVideo);
      }
    };

    currentVideo.addEventListener("ended", handleEnded);
    currentVideo.addEventListener("timeupdate", handleTimeUpdate);
    currentVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
    currentVideo.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      currentVideo.removeEventListener("ended", handleEnded);
      currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
      currentVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
      currentVideo.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [activeIndex, advanceToNext, isPlaying, scheduleAdvance, attemptPlay]);

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
