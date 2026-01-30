import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MontageSegment {
  src: string;
  startTime: number;
  endTime: number;
}

const AUDIO_DURATION = 128;

const montageTimeline: MontageSegment[] = [
  { src: "/videos/soldiers-marching-new.mp4", startTime: 0, endTime: 8 },
  { src: "/videos/montage-rain.mp4", startTime: 8, endTime: 14 },
  { src: "/videos/montage-embrace-1.mp4", startTime: 14, endTime: 20 },
  { src: "/videos/montage-clip.mp4", startTime: 20, endTime: 28 },
  { src: "/videos/montage-salute.mp4", startTime: 28, endTime: 34 },
  { src: "/videos/soldiers-marching-new.mp4", startTime: 34, endTime: 42 },
  { src: "/videos/montage-gear.mp4", startTime: 42, endTime: 48 },
  { src: "/videos/montage-embrace-2.mp4", startTime: 48, endTime: 54 },
  { src: "/videos/montage-helicopter.mp4", startTime: 54, endTime: 62 },
  { src: "/videos/montage-rain.mp4", startTime: 62, endTime: 68 },
  { src: "/videos/montage-clip.mp4", startTime: 68, endTime: 76 },
  { src: "/videos/montage-salute.mp4", startTime: 76, endTime: 82 },
  { src: "/videos/montage-embrace-1.mp4", startTime: 82, endTime: 90 },
  { src: "/videos/soldiers-marching-new.mp4", startTime: 90, endTime: 100 },
  { src: "/videos/montage-helicopter.mp4", startTime: 100, endTime: 110 },
  { src: "/videos/montage-iwojima.mp4", startTime: 110, endTime: 128 },
];

const uniqueVideos = Array.from(new Set(montageTimeline.map(s => s.src)));

interface HeroMontageProps {
  isActive?: boolean;
  onMontageEnd?: () => void;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

export function HeroMontage({ isActive = true, onMontageEnd, audioRef }: HeroMontageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  const getCurrentSegmentIndex = useCallback((time: number) => {
    for (let i = 0; i < montageTimeline.length; i++) {
      if (time >= montageTimeline[i].startTime && time < montageTimeline[i].endTime) {
        return i;
      }
    }
    return montageTimeline.length - 1;
  }, []);

  const stopMontage = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    videoRefs.current.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
    setIsPlaying(false);
    setDisplayTime(0);
    setActiveIndex(0);
    hasStartedRef.current = false;
  }, []);

  const startMontage = useCallback(() => {
    if (hasStartedRef.current) return;
    if (!audioRef?.current) return;
    
    hasStartedRef.current = true;
    setActiveIndex(0);
    setDisplayTime(0);
    setIsPlaying(true);

    const firstVideo = videoRefs.current.get(montageTimeline[0].src);
    if (firstVideo) {
      firstVideo.currentTime = 0;
      firstVideo.loop = true;
      firstVideo.play().catch(() => {});
    }

    intervalRef.current = setInterval(() => {
      if (!audioRef?.current) return;
      
      const currentTime = audioRef.current.currentTime;
      setDisplayTime(Math.floor(currentTime));
      
      const newIndex = getCurrentSegmentIndex(currentTime);
      setActiveIndex(prev => {
        if (prev !== newIndex) {
          return newIndex;
        }
        return prev;
      });

      if (currentTime >= AUDIO_DURATION) {
        stopMontage();
        onMontageEnd?.();
      }
    }, 100);
  }, [audioRef, getCurrentSegmentIndex, onMontageEnd, stopMontage]);

  useEffect(() => {
    if (isActive && !isPlaying && !hasStartedRef.current && audioRef?.current) {
      const audio = audioRef.current;
      
      // Start immediately if audio is already playing (even if currentTime is 0)
      if (!audio.paused) {
        startMontage();
        return;
      }
      
      // Otherwise, listen for play event AND timeupdate as fallback
      const handlePlay = () => {
        startMontage();
        cleanup();
      };
      
      const handleTimeUpdate = () => {
        if (!audio.paused && !hasStartedRef.current) {
          startMontage();
          cleanup();
        }
      };
      
      const cleanup = () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
      
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      return cleanup;
    }
    
    if (!isActive && isPlaying) {
      stopMontage();
    }
  }, [isActive, isPlaying, startMontage, stopMontage, audioRef]);

  useEffect(() => {
    if (!isPlaying) return;

    const currentSegment = montageTimeline[activeIndex];

    videoRefs.current.forEach((video, src) => {
      if (src === currentSegment.src) {
        // Don't reset currentTime - let the video loop naturally to avoid glitches
        if (video.paused) {
          video.loop = true;
          video.play().catch(() => {});
        }
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isPlaying]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy">
      {uniqueVideos.map((src) => (
        <video
          key={src}
          ref={el => { if (el) videoRefs.current.set(src, el); }}
          src={src}
          muted
          playsInline
          preload="auto"
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out",
            montageTimeline[activeIndex]?.src === src ? "opacity-100" : "opacity-0"
          )}
          style={{ zIndex: montageTimeline[activeIndex]?.src === src ? 1 : 0 }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-brand-navy/30 z-10" />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
        {montageTimeline.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500",
              index === activeIndex 
                ? "bg-brand-gold w-4 sm:w-6" 
                : index < activeIndex
                  ? "bg-white/60"
                  : "bg-white/30"
            )}
          />
        ))}
      </div>

      {isPlaying && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded text-sm font-mono">
          {displayTime}s / {AUDIO_DURATION}s
        </div>
      )}
    </div>
  );
}
