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
  { src: "/videos/soldiers-marching-new.mp4", startTime: 90, endTime: 98 },
  { src: "/videos/montage-helicopter.mp4", startTime: 98, endTime: 106 },
  { src: "/videos/montage-iwojima.mp4", startTime: 106, endTime: 118 },
];

const uniqueVideos = Array.from(new Set(montageTimeline.map(s => s.src)));

interface HeroMontageProps {
  isActive?: boolean;
  onMontageEnd?: () => void;
}

export function HeroMontage({ isActive = true, onMontageEnd }: HeroMontageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const userInteractedRef = useRef(false);

  const getCurrentSegmentIndex = useCallback((time: number) => {
    for (let i = 0; i < montageTimeline.length; i++) {
      if (time >= montageTimeline[i].startTime && time < montageTimeline[i].endTime) {
        return i;
      }
    }
    return montageTimeline.length - 1;
  }, []);

  const stopMontage = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    videoRefs.current.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
    setIsPlaying(false);
    startTimeRef.current = null;
    setElapsedTime(0);
    setActiveIndex(0);
  }, []);

  const updateMontage = useCallback(() => {
    if (!startTimeRef.current || !isPlaying) return;

    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    setElapsedTime(elapsed);

    if (elapsed >= 118) {
      stopMontage();
      onMontageEnd?.();
      return;
    }

    const newIndex = getCurrentSegmentIndex(elapsed);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }

    animationFrameRef.current = requestAnimationFrame(updateMontage);
  }, [activeIndex, getCurrentSegmentIndex, isPlaying, onMontageEnd, stopMontage]);

  const startMontage = useCallback(() => {
    userInteractedRef.current = true;
    setNeedsInteraction(false);
    setIsPlaying(true);
    startTimeRef.current = performance.now();
    setActiveIndex(0);
    setElapsedTime(0);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    const firstVideo = videoRefs.current.get(montageTimeline[0].src);
    if (firstVideo) {
      firstVideo.currentTime = 0;
      firstVideo.play().catch(() => {});
    }

    animationFrameRef.current = requestAnimationFrame(updateMontage);
  }, [updateMontage]);

  const handleTapToPlay = useCallback(() => {
    startMontage();
  }, [startMontage]);

  useEffect(() => {
    if (isActive && !isPlaying && !needsInteraction) {
      const firstVideo = videoRefs.current.get(montageTimeline[0].src);
      if (firstVideo) {
        firstVideo.currentTime = 0;
        const playPromise = firstVideo.play();
        if (playPromise) {
          playPromise.then(() => {
            userInteractedRef.current = true;
            startMontage();
          }).catch(() => {
            setNeedsInteraction(true);
          });
        }
      }

      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isActive, isPlaying, needsInteraction, startMontage]);

  useEffect(() => {
    if (!isPlaying) return;

    const currentSegment = montageTimeline[activeIndex];
    const currentVideo = videoRefs.current.get(currentSegment.src);

    videoRefs.current.forEach((video, src) => {
      if (src === currentSegment.src) {
        if (video.paused) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      } else {
        video.pause();
      }
    });

    if (currentVideo) {
      const segmentDuration = currentSegment.endTime - currentSegment.startTime;
      const videoDuration = currentVideo.duration || 4;
      
      if (videoDuration < segmentDuration) {
        currentVideo.loop = true;
      } else {
        currentVideo.loop = false;
      }
    }
  }, [activeIndex, isPlaying]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy">
      <audio
        ref={audioRef}
        src="/audio/montage-music.mp3"
        preload="auto"
      />

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
          {Math.floor(elapsedTime)}s / 118s
        </div>
      )}
    </div>
  );
}
