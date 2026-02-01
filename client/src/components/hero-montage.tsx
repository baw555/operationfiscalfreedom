import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MontageSegment {
  src: string;
  startTime: number;
  endTime: number;
  description: string;
}

// Timeline aligned to music - 257 seconds total
// 0-25s: Text sequence plays (montage not visible yet)
// 25s+: Montage becomes visible - GEAR video should be first seen
const montageTimeline: MontageSegment[] = [
  // Not visible during text sequence (0-25s)
  { src: "/videos/soldiers-marching-new.mp4", startTime: 0, endTime: 15, description: "march" },
  { src: "/videos/montage-rain.mp4", startTime: 15, endTime: 25, description: "rain" },
  
  // FIRST VISIBLE: Soldiers loading gear when montage appears (~25s)
  { src: "/videos/montage-gear.mp4", startTime: 25, endTime: 40, description: "gear up - first visible" },
  
  // Action sequence
  { src: "/videos/montage-clip.mp4", startTime: 40, endTime: 55, description: "shooting/action" },
  { src: "/videos/montage-helicopter.mp4", startTime: 55, endTime: 70, description: "helicopter" },
  
  // Emotional section
  { src: "/videos/montage-embrace-1.mp4", startTime: 70, endTime: 90, description: "embrace" },
  { src: "/videos/montage-embrace-2.mp4", startTime: 90, endTime: 110, description: "crying/emotion" },
  
  // Building momentum
  { src: "/videos/soldiers-marching-new.mp4", startTime: 110, endTime: 130, description: "march again" },
  { src: "/videos/montage-salute.mp4", startTime: 130, endTime: 150, description: "salute" },
  { src: "/videos/montage-helicopter.mp4", startTime: 150, endTime: 170, description: "helicopter" },
  
  // Second wave - repeat cycle
  { src: "/videos/montage-gear.mp4", startTime: 170, endTime: 185, description: "gear up" },
  { src: "/videos/montage-clip.mp4", startTime: 185, endTime: 200, description: "action" },
  { src: "/videos/montage-embrace-1.mp4", startTime: 200, endTime: 215, description: "embrace" },
  { src: "/videos/soldiers-marching-new.mp4", startTime: 215, endTime: 230, description: "march" },
  
  // Finale - Iwo Jima flag raising
  { src: "/videos/montage-iwojima.mp4", startTime: 230, endTime: 257, description: "iwo jima - finale" },
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
  const [audioDuration, setAudioDuration] = useState(257);
  
  // Single video element approach - only one video plays at a time
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const hasStartedRef = useRef(false);
  const lastIndexRef = useRef(-1);
  const preloadedRef = useRef<Set<string>>(new Set());

  // Get audio duration from metadata
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    
    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setAudioDuration(Math.floor(audio.duration));
      }
    };
    
    // Check if already loaded
    if (audio.duration && !isNaN(audio.duration)) {
      setAudioDuration(Math.floor(audio.duration));
    }
    
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => audio.removeEventListener('loadedmetadata', onLoadedMetadata);
  }, [audioRef]);

  // Find segment for current time
  const getSegmentIndex = useCallback((time: number) => {
    for (let i = 0; i < montageTimeline.length; i++) {
      if (time >= montageTimeline[i].startTime && time < montageTimeline[i].endTime) {
        return i;
      }
    }
    return montageTimeline.length - 1;
  }, []);

  // Sync video to correct position within current segment
  const syncCurrentVideo = useCallback((forceSync = false) => {
    const audio = audioRef?.current;
    if (!audio) return;
    
    const time = audio.currentTime;
    const segmentIndex = getSegmentIndex(time);
    const segment = montageTimeline[segmentIndex];
    const video = videoRefs.current.get(segment.src);
    
    if (video) {
      const segmentElapsed = time - segment.startTime;
      const expectedTime = Math.min(segmentElapsed, video.duration || 999);
      const drift = Math.abs(video.currentTime - expectedTime);
      
      // Resync if drift > 0.5s or forced (seek event)
      if (drift > 0.5 || forceSync) {
        video.currentTime = expectedTime;
      }
    }
  }, [audioRef, getSegmentIndex]);

  // Main sync handler - called on audio timeupdate
  const syncToAudio = useCallback(() => {
    const audio = audioRef?.current;
    if (!audio || audio.paused) return;
    
    const time = audio.currentTime;
    setDisplayTime(Math.floor(time));
    
    const segmentIndex = getSegmentIndex(time);
    const segment = montageTimeline[segmentIndex];
    
    // Handle segment change
    if (segmentIndex !== lastIndexRef.current) {
      lastIndexRef.current = segmentIndex;
      setActiveIndex(segmentIndex);
      
      // Pause all videos, play the new one
      videoRefs.current.forEach((video, src) => {
        if (src === segment.src) {
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
    } else {
      // Within same segment - check for drift and resync if needed
      syncCurrentVideo(false);
    }
  }, [audioRef, getSegmentIndex, syncCurrentVideo]);

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
    const onSeeked = () => {
      // Force resync when user seeks in audio
      const time = audio.currentTime;
      const segmentIndex = getSegmentIndex(time);
      const segment = montageTimeline[segmentIndex];
      
      // Update state
      lastIndexRef.current = segmentIndex;
      setActiveIndex(segmentIndex);
      
      // Switch to correct video and sync position
      videoRefs.current.forEach((video, src) => {
        if (src === segment.src) {
          const segmentElapsed = time - segment.startTime;
          video.currentTime = Math.min(segmentElapsed, video.duration || 999);
          if (!audio.paused) video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('seeked', onSeeked);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('seeked', onSeeked);
    };
  }, [audioRef, syncToAudio, startMontage, isActive, activeIndex, getSegmentIndex]);

  // Handle isActive changes - also start if mounting while audio is already playing
  useEffect(() => {
    if (isActive && !isPlaying && audioRef?.current && !audioRef.current.paused) {
      // Small delay to ensure video refs are populated
      const timer = setTimeout(() => {
        if (!hasStartedRef.current) {
          startMontage();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    if (!isActive && isPlaying) {
      stopMontage();
    }
  }, [isActive, isPlaying, startMontage, stopMontage, audioRef]);

  // Also check on initial mount if audio is already playing
  useEffect(() => {
    const audio = audioRef?.current;
    if (audio && !audio.paused && isActive && !hasStartedRef.current) {
      // Audio already playing when component mounts - start immediately
      const timer = setTimeout(() => {
        if (!hasStartedRef.current && videoRefs.current.size > 0) {
          startMontage();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [audioRef, isActive, startMontage]);

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
          {displayTime}s / {audioDuration}s
        </div>
      )}
    </div>
  );
}
