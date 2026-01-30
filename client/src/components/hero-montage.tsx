import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MontageSegment {
  src: string;
  startTime: number;
  endTime: number;
}

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
  const [audioDuration, setAudioDuration] = useState(128);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const hasStartedRef = useRef(false);
  const lastSegmentIndexRef = useRef(0);

  const getCurrentSegmentIndex = useCallback((time: number) => {
    for (let i = 0; i < montageTimeline.length; i++) {
      if (time >= montageTimeline[i].startTime && time < montageTimeline[i].endTime) {
        return i;
      }
    }
    return montageTimeline.length - 1;
  }, []);

  const stopMontage = useCallback(() => {
    videoRefs.current.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
    setIsPlaying(false);
    setDisplayTime(0);
    setActiveIndex(0);
    hasStartedRef.current = false;
    lastSegmentIndexRef.current = 0;
  }, []);

  // Handle audio timeupdate - this is the source of truth for sync
  const handleTimeUpdate = useCallback(() => {
    if (!audioRef?.current || !isPlaying) return;
    
    const audio = audioRef.current;
    const currentTime = audio.currentTime;
    
    setDisplayTime(Math.floor(currentTime));
    
    const newIndex = getCurrentSegmentIndex(currentTime);
    const currentSegment = montageTimeline[newIndex];
    const currentVideo = videoRefs.current.get(currentSegment.src);
    
    // Continuous sync: always keep video aligned to audio time within segment
    if (currentVideo && !audio.paused) {
      const segmentElapsed = currentTime - currentSegment.startTime;
      const videoDuration = currentVideo.duration || 10;
      const expectedVideoTime = segmentElapsed % videoDuration;
      
      // Only resync if drift is noticeable (> 0.3s) to avoid constant seeking
      if (Math.abs(currentVideo.currentTime - expectedVideoTime) > 0.3) {
        currentVideo.currentTime = expectedVideoTime;
      }
    }
    
    // Handle segment change
    if (newIndex !== lastSegmentIndexRef.current) {
      lastSegmentIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      
      // Switch videos: pause all, play new one
      videoRefs.current.forEach((video, src) => {
        if (src === currentSegment.src) {
          const segmentElapsed = currentTime - currentSegment.startTime;
          const videoDuration = video.duration || 10;
          video.currentTime = segmentElapsed % videoDuration;
          video.loop = true;
          if (video.paused && !audio.paused) {
            video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      });
    }
  }, [audioRef, isPlaying, getCurrentSegmentIndex]);

  // Handle audio pause/play for video sync
  const handleAudioPause = useCallback(() => {
    videoRefs.current.forEach(video => {
      if (!video.paused) video.pause();
    });
  }, []);

  const handleAudioPlay = useCallback(() => {
    if (!isPlaying) return;
    const currentSegment = montageTimeline[activeIndex];
    const currentVideo = videoRefs.current.get(currentSegment.src);
    if (currentVideo?.paused) {
      currentVideo.loop = true;
      currentVideo.play().catch(() => {});
    }
  }, [isPlaying, activeIndex]);

  // Start montage when audio starts
  const startMontage = useCallback(() => {
    if (hasStartedRef.current) return;
    if (!audioRef?.current) return;
    
    hasStartedRef.current = true;
    const audio = audioRef.current;
    const currentTime = audio.currentTime;
    
    // Get actual audio duration from metadata
    if (audio.duration && !isNaN(audio.duration)) {
      setAudioDuration(Math.floor(audio.duration));
    }
    
    // Find the correct segment based on current audio time (not always 0)
    const initialIndex = getCurrentSegmentIndex(currentTime);
    lastSegmentIndexRef.current = initialIndex;
    setActiveIndex(initialIndex);
    setDisplayTime(Math.floor(currentTime));
    setIsPlaying(true);

    // Start the correct video at the right time within its segment
    const initialSegment = montageTimeline[initialIndex];
    const initialVideo = videoRefs.current.get(initialSegment.src);
    if (initialVideo) {
      const segmentElapsed = currentTime - initialSegment.startTime;
      const videoDuration = initialVideo.duration || 10;
      initialVideo.currentTime = segmentElapsed % videoDuration;
      initialVideo.loop = true;
      initialVideo.play().catch(() => {});
    }
    
    // Pause all other videos
    videoRefs.current.forEach((video, src) => {
      if (src !== initialSegment.src) {
        video.pause();
      }
    });
  }, [audioRef, getCurrentSegmentIndex]);

  // Effect to set up audio event listeners
  useEffect(() => {
    if (!audioRef?.current) return;
    
    const audio = audioRef.current;
    
    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('pause', handleAudioPause);
    audio.addEventListener('play', handleAudioPlay);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('pause', handleAudioPause);
      audio.removeEventListener('play', handleAudioPlay);
    };
  }, [audioRef, handleTimeUpdate, handleAudioPause, handleAudioPlay]);

  // Effect to start montage when component becomes active
  useEffect(() => {
    if (isActive && !isPlaying && !hasStartedRef.current && audioRef?.current) {
      const audio = audioRef.current;
      
      // Start immediately if audio is already playing
      if (!audio.paused) {
        startMontage();
        return;
      }
      
      // Otherwise, listen for play event
      const handlePlay = () => {
        startMontage();
        audio.removeEventListener('play', handlePlay);
      };
      
      audio.addEventListener('play', handlePlay);
      return () => audio.removeEventListener('play', handlePlay);
    }
    
    if (!isActive && isPlaying) {
      stopMontage();
    }
  }, [isActive, isPlaying, startMontage, stopMontage, audioRef]);

  // Effect to handle video switching based on activeIndex
  useEffect(() => {
    if (!isPlaying || !audioRef?.current) return;

    const currentSegment = montageTimeline[activeIndex];
    const audio = audioRef.current;

    videoRefs.current.forEach((video, src) => {
      if (src === currentSegment.src) {
        if (video.paused && !audio.paused) {
          video.loop = true;
          video.play().catch(() => {});
        }
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isPlaying, audioRef]);

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
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out",
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

      {isPlaying && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded text-sm font-mono">
          {displayTime}s / {audioDuration}s
        </div>
      )}
    </div>
  );
}
