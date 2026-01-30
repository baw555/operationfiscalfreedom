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
  const rafRef = useRef<number | null>(null);
  const preloadedVideosRef = useRef<Set<string>>(new Set());

  const getCurrentSegmentIndex = useCallback((time: number) => {
    for (let i = 0; i < montageTimeline.length; i++) {
      if (time >= montageTimeline[i].startTime && time < montageTimeline[i].endTime) {
        return i;
      }
    }
    return montageTimeline.length - 1;
  }, []);

  const stopMontage = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
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

  // RAF-based sync loop for smooth audio-video synchronization - idles when paused
  const syncLoop = useCallback(() => {
    if (!audioRef?.current || !isPlaying) {
      rafRef.current = null;
      return;
    }
    
    const audio = audioRef.current;
    
    // Stop RAF when paused - will restart via play event handler
    if (audio.paused) {
      rafRef.current = null;
      return;
    }
    
    const currentTime = audio.currentTime;
    setDisplayTime(Math.floor(currentTime));
    
    const newIndex = getCurrentSegmentIndex(currentTime);
    const currentSegment = montageTimeline[newIndex];
    const currentVideo = videoRefs.current.get(currentSegment.src);
    
    // Continuous sync: keep video aligned to audio time
    if (currentVideo && !audio.paused) {
      const segmentElapsed = currentTime - currentSegment.startTime;
      const videoDuration = currentVideo.duration || 10;
      const expectedVideoTime = segmentElapsed % videoDuration;
      
      if (Math.abs(currentVideo.currentTime - expectedVideoTime) > 0.2) {
        currentVideo.currentTime = expectedVideoTime;
      }
    }
    
    // Handle segment change
    if (newIndex !== lastSegmentIndexRef.current) {
      lastSegmentIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      
      // Switch videos
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
      
      // Preload next segment video
      const nextIndex = Math.min(newIndex + 1, montageTimeline.length - 1);
      const nextSrc = montageTimeline[nextIndex].src;
      if (!preloadedVideosRef.current.has(nextSrc)) {
        const nextVideo = videoRefs.current.get(nextSrc);
        if (nextVideo) {
          nextVideo.preload = "auto";
          preloadedVideosRef.current.add(nextSrc);
        }
      }
    }

    rafRef.current = requestAnimationFrame(syncLoop);
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
    // Restart RAF loop when audio resumes
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(syncLoop);
    }
  }, [isPlaying, activeIndex, syncLoop]);

  // Start montage
  const startMontage = useCallback(() => {
    if (hasStartedRef.current) return;
    if (!audioRef?.current) return;
    
    hasStartedRef.current = true;
    const audio = audioRef.current;
    const currentTime = audio.currentTime;
    
    if (audio.duration && !isNaN(audio.duration)) {
      setAudioDuration(Math.floor(audio.duration));
    }
    
    const initialIndex = getCurrentSegmentIndex(currentTime);
    lastSegmentIndexRef.current = initialIndex;
    setActiveIndex(initialIndex);
    setDisplayTime(Math.floor(currentTime));
    setIsPlaying(true);

    // Start correct video at right time
    const initialSegment = montageTimeline[initialIndex];
    const initialVideo = videoRefs.current.get(initialSegment.src);
    if (initialVideo) {
      const segmentElapsed = currentTime - initialSegment.startTime;
      const videoDuration = initialVideo.duration || 10;
      initialVideo.currentTime = segmentElapsed % videoDuration;
      initialVideo.loop = true;
      initialVideo.play().catch(() => {});
    }
    
    // Pause other videos
    videoRefs.current.forEach((video, src) => {
      if (src !== initialSegment.src) {
        video.pause();
      }
    });

    // Start RAF sync loop
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(syncLoop);
  }, [audioRef, getCurrentSegmentIndex, syncLoop]);

  // Set up audio event listeners
  useEffect(() => {
    if (!audioRef?.current) return;
    
    const audio = audioRef.current;
    audio.addEventListener('pause', handleAudioPause);
    audio.addEventListener('play', handleAudioPlay);
    
    return () => {
      audio.removeEventListener('pause', handleAudioPause);
      audio.removeEventListener('play', handleAudioPlay);
    };
  }, [audioRef, handleAudioPause, handleAudioPlay]);

  // Start montage when active
  useEffect(() => {
    if (isActive && !isPlaying && !hasStartedRef.current && audioRef?.current) {
      const audio = audioRef.current;
      
      if (!audio.paused) {
        startMontage();
        return;
      }
      
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

  // Keep RAF running while montage is playing
  useEffect(() => {
    if (isPlaying && !rafRef.current && audioRef?.current && !audioRef.current.paused) {
      rafRef.current = requestAnimationFrame(syncLoop);
    }
  }, [isPlaying, syncLoop, audioRef]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy">
      {uniqueVideos.map((src, i) => (
        <video
          key={src}
          ref={el => { if (el) videoRefs.current.set(src, el); }}
          src={src}
          muted
          playsInline
          preload={i < 2 ? "auto" : "metadata"}
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
