import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MontageSegment {
  src: string;
  startTime: number;
  endTime: number;
  description: string;
}

// Timeline aligned to music beats:
// 0-25s: Text sequence plays (montage not visible yet)
// 25s+: Montage starts - times are relative to song start
const montageTimeline: MontageSegment[] = [
  // Opening - marching soldiers, building anticipation
  { src: "/videos/soldiers-marching-new.mp4", startTime: 0, endTime: 12, description: "march" },
  { src: "/videos/montage-rain.mp4", startTime: 12, endTime: 20, description: "rain" },
  
  // Percussion hits - action/shooting footage
  { src: "/videos/montage-clip.mp4", startTime: 20, endTime: 32, description: "shooting/action" },
  { src: "/videos/montage-gear.mp4", startTime: 32, endTime: 40, description: "gear up" },
  
  // Building intensity
  { src: "/videos/montage-helicopter.mp4", startTime: 40, endTime: 50, description: "helicopter" },
  { src: "/videos/montage-salute.mp4", startTime: 50, endTime: 58, description: "salute" },
  
  // Serious/emotional section - embrace and crying
  { src: "/videos/montage-embrace-1.mp4", startTime: 58, endTime: 68, description: "embrace" },
  { src: "/videos/montage-embrace-2.mp4", startTime: 68, endTime: 78, description: "crying/emotion" },
  
  // Building to climax
  { src: "/videos/soldiers-marching-new.mp4", startTime: 78, endTime: 88, description: "march again" },
  { src: "/videos/montage-helicopter.mp4", startTime: 88, endTime: 98, description: "helicopter" },
  { src: "/videos/montage-salute.mp4", startTime: 98, endTime: 108, description: "salute" },
  
  // Finale - Iwo Jima flag raising
  { src: "/videos/montage-iwojima.mp4", startTime: 108, endTime: 128, description: "iwo jima - finale" },
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
  
  // Single video element approach - only one video plays at a time
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const hasStartedRef = useRef(false);
  const lastIndexRef = useRef(-1);
  const preloadedRef = useRef<Set<string>>(new Set());

  // Find segment for current time
  const getSegmentIndex = useCallback((time: number) => {
    for (let i = 0; i < montageTimeline.length; i++) {
      if (time >= montageTimeline[i].startTime && time < montageTimeline[i].endTime) {
        return i;
      }
    }
    return montageTimeline.length - 1;
  }, []);

  // Main sync handler - called on audio timeupdate
  const syncToAudio = useCallback(() => {
    const audio = audioRef?.current;
    if (!audio || audio.paused) return;
    
    const time = audio.currentTime;
    setDisplayTime(Math.floor(time));
    
    const segmentIndex = getSegmentIndex(time);
    const segment = montageTimeline[segmentIndex];
    
    // Only switch video when segment changes
    if (segmentIndex !== lastIndexRef.current) {
      lastIndexRef.current = segmentIndex;
      setActiveIndex(segmentIndex);
      
      // Pause all videos, play the new one
      videoRefs.current.forEach((video, src) => {
        if (src === segment.src) {
          // Calculate where in the video we should be
          const segmentElapsed = time - segment.startTime;
          video.currentTime = Math.min(segmentElapsed, video.duration || 999);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
      
      // Preload next video
      const nextIndex = Math.min(segmentIndex + 1, montageTimeline.length - 1);
      const nextSrc = montageTimeline[nextIndex].src;
      if (!preloadedRef.current.has(nextSrc)) {
        const nextVideo = videoRefs.current.get(nextSrc);
        if (nextVideo) {
          nextVideo.preload = "auto";
          preloadedRef.current.add(nextSrc);
        }
      }
    }
  }, [audioRef, getSegmentIndex]);

  // Start montage
  const startMontage = useCallback(() => {
    if (hasStartedRef.current || !audioRef?.current) return;
    hasStartedRef.current = true;
    
    const audio = audioRef.current;
    const initialIndex = getSegmentIndex(audio.currentTime);
    lastIndexRef.current = initialIndex;
    setActiveIndex(initialIndex);
    setIsPlaying(true);
    
    // Start the correct video
    const segment = montageTimeline[initialIndex];
    const video = videoRefs.current.get(segment.src);
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [audioRef, getSegmentIndex]);

  // Stop montage
  const stopMontage = useCallback(() => {
    videoRefs.current.forEach(v => {
      v.pause();
      v.currentTime = 0;
    });
    setIsPlaying(false);
    setActiveIndex(0);
    hasStartedRef.current = false;
    lastIndexRef.current = -1;
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const onTimeUpdate = () => syncToAudio();
    const onPlay = () => {
      if (!hasStartedRef.current && isActive) startMontage();
      const segment = montageTimeline[activeIndex];
      const video = videoRefs.current.get(segment.src);
      if (video?.paused) video.play().catch(() => {});
    };
    const onPause = () => {
      videoRefs.current.forEach(v => { if (!v.paused) v.pause(); });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [audioRef, syncToAudio, startMontage, isActive, activeIndex]);

  // Handle isActive changes
  useEffect(() => {
    if (isActive && !isPlaying && audioRef?.current && !audioRef.current.paused) {
      startMontage();
    }
    if (!isActive && isPlaying) {
      stopMontage();
    }
  }, [isActive, isPlaying, startMontage, stopMontage, audioRef]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy">
      {/* Render all videos but only show active one */}
      {uniqueVideos.map((src, i) => (
        <video
          key={src}
          ref={el => { if (el) videoRefs.current.set(src, el); }}
          src={src}
          muted
          playsInline
          preload={i < 2 ? "auto" : "metadata"}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out",
            montageTimeline[activeIndex]?.src === src ? "opacity-100" : "opacity-0"
          )}
          style={{ zIndex: montageTimeline[activeIndex]?.src === src ? 1 : 0 }}
        />
      ))}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-brand-navy/30 z-10" />
      
      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
        {montageTimeline.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300",
              index === activeIndex 
                ? "bg-brand-gold w-4 sm:w-6" 
                : index < activeIndex
                  ? "bg-white/60"
                  : "bg-white/30"
            )}
          />
        ))}
      </div>

      {/* Time display */}
      {isPlaying && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded text-sm font-mono">
          {displayTime}s / 128s
        </div>
      )}
    </div>
  );
}
