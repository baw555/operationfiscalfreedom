import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MontageSegment {
  src: string;
  startTime: number;
  endTime: number;
  description: string;
}

// Base video sequence - will be built dynamically from actual durations
const videoSequence = [
  { src: "/videos/soldiers-marching.mp4", description: "march" },
  { src: "/videos/montage-rain.mp4", description: "rain" },
  { src: "/videos/montage-gear.mp4", description: "gear up" },
  { src: "/videos/montage-clip.mp4", description: "action" },
  { src: "/videos/montage-helicopter.mp4", description: "helicopter" },
  { src: "/videos/montage-embrace-1.mp4", description: "embrace" },
  { src: "/videos/montage-embrace-2.mp4", description: "emotion" },
  { src: "/videos/montage-salute.mp4", description: "salute" },
  { src: "/videos/montage-iwojima.mp4", description: "finale" },
];

const uniqueVideos = Array.from(new Set(videoSequence.map(s => s.src)));

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
  const [videosReady, setVideosReady] = useState(false);
  const [timeline, setTimeline] = useState<MontageSegment[]>([]);
  
  // Double buffer approach
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeBuffer, setActiveBuffer] = useState<'A' | 'B'>('A');
  
  // Track state
  const videoMetadata = useRef<Map<string, number>>(new Map());
  const hasStartedRef = useRef(false);
  const lastIndexRef = useRef(-1);
  const lastSrcRef = useRef<string>('');
  const transitionIdRef = useRef(0);

  // Build timeline from actual video durations
  const buildTimeline = useCallback((durations: Map<string, number>, targetDuration: number) => {
    const segments: MontageSegment[] = [];
    let currentTime = 0;
    let sequenceIndex = 0;
    
    // Build segments until we reach target duration
    while (currentTime < targetDuration) {
      const video = videoSequence[sequenceIndex % videoSequence.length];
      const duration = durations.get(video.src) || 15; // Fallback to 15s
      const endTime = Math.min(currentTime + duration, targetDuration);
      
      segments.push({
        src: video.src,
        startTime: currentTime,
        endTime: endTime,
        description: video.description,
      });
      
      currentTime = endTime;
      sequenceIndex++;
    }
    
    return segments;
  }, []);

  // Preload all videos and get durations
  useEffect(() => {
    let loadedCount = 0;
    const totalVideos = uniqueVideos.length;
    const durations = new Map<string, number>();
    const cleanupVideos: HTMLVideoElement[] = [];
    
    const checkComplete = () => {
      if (loadedCount >= totalVideos) {
        videoMetadata.current = durations;
        // Build timeline with actual audio duration or default
        const targetDuration = audioDuration || 257;
        const newTimeline = buildTimeline(durations, targetDuration);
        setTimeline(newTimeline);
        setVideosReady(true);
      }
    };
    
    uniqueVideos.forEach(src => {
      const video = document.createElement('video');
      video.preload = 'metadata'; // Only load metadata, not full video
      video.muted = true;
      video.playsInline = true;
      video.src = src;
      cleanupVideos.push(video);
      
      video.onloadedmetadata = () => {
        durations.set(src, video.duration);
        loadedCount++;
        checkComplete();
      };
      
      video.onerror = () => {
        durations.set(src, 15); // Default 15s on error
        loadedCount++;
        checkComplete();
      };
      
      video.load();
    });

    return () => {
      cleanupVideos.forEach(v => {
        v.onloadedmetadata = null;
        v.onerror = null;
        v.src = '';
      });
    };
  }, [audioDuration, buildTimeline]);

  // Get audio duration
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;
    
    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setAudioDuration(Math.floor(audio.duration));
      }
    };
    
    if (audio.duration && !isNaN(audio.duration)) {
      setAudioDuration(Math.floor(audio.duration));
    }
    
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => audio.removeEventListener('loadedmetadata', onLoadedMetadata);
  }, [audioRef]);

  // Find segment for current time
  const getSegmentIndex = useCallback((time: number) => {
    for (let i = 0; i < timeline.length; i++) {
      if (time >= timeline[i].startTime && time < timeline[i].endTime) {
        return i;
      }
    }
    return Math.max(0, timeline.length - 1);
  }, [timeline]);

  // Get current/next video refs
  const getCurrentVideo = useCallback(() => {
    return activeBuffer === 'A' ? videoARef.current : videoBRef.current;
  }, [activeBuffer]);

  const getNextVideo = useCallback(() => {
    return activeBuffer === 'A' ? videoBRef.current : videoARef.current;
  }, [activeBuffer]);

  // Switch to segment - only if src changes
  const switchToSegment = useCallback((segmentIndex: number, audioTime: number) => {
    if (timeline.length === 0) return;
    
    const segment = timeline[segmentIndex];
    if (!segment) return;
    
    // Skip if same video source
    if (segment.src === lastSrcRef.current) {
      return;
    }
    
    const nextVideo = getNextVideo();
    const currentVideo = getCurrentVideo();
    if (!nextVideo) return;
    
    lastSrcRef.current = segment.src;
    transitionIdRef.current++;
    const thisTransitionId = transitionIdRef.current;
    
    // Calculate video start time
    const segmentElapsed = audioTime - segment.startTime;
    const videoDuration = videoMetadata.current.get(segment.src) || 15;
    const videoTime = Math.min(segmentElapsed, videoDuration);
    
    nextVideo.src = segment.src;
    nextVideo.currentTime = videoTime;
    nextVideo.loop = false; // No loop - play full then move to next
    
    const onCanPlay = () => {
      if (thisTransitionId !== transitionIdRef.current) return;
      
      nextVideo.removeEventListener('canplay', onCanPlay);
      nextVideo.play().catch(() => {});
      setActiveBuffer(prev => prev === 'A' ? 'B' : 'A');
      
      setTimeout(() => {
        if (currentVideo && thisTransitionId === transitionIdRef.current) {
          currentVideo.pause();
        }
      }, 700);
    };
    
    nextVideo.addEventListener('canplay', onCanPlay);
    nextVideo.load();
  }, [timeline, getCurrentVideo, getNextVideo]);

  // Main sync handler
  const syncToAudio = useCallback(() => {
    const audio = audioRef?.current;
    if (!audio || audio.paused || timeline.length === 0) return;
    
    const time = audio.currentTime;
    setDisplayTime(Math.floor(time));
    
    const segmentIndex = getSegmentIndex(time);
    
    // Handle segment change
    if (segmentIndex !== lastIndexRef.current) {
      lastIndexRef.current = segmentIndex;
      setActiveIndex(segmentIndex);
      switchToSegment(segmentIndex, time);
    }
  }, [audioRef, getSegmentIndex, switchToSegment, timeline]);

  // Start montage
  const startMontage = useCallback(() => {
    if (hasStartedRef.current || !audioRef?.current || !videosReady || timeline.length === 0) return;
    hasStartedRef.current = true;
    
    const audio = audioRef.current;
    const audioTime = audio.currentTime;
    const initialIndex = getSegmentIndex(audioTime);
    const segment = timeline[initialIndex];
    
    if (!segment) return;
    
    lastIndexRef.current = initialIndex;
    lastSrcRef.current = segment.src;
    setActiveIndex(initialIndex);
    setIsPlaying(true);
    
    const video = getCurrentVideo();
    if (video) {
      const segmentElapsed = audioTime - segment.startTime;
      const videoDuration = videoMetadata.current.get(segment.src) || 15;
      
      video.src = segment.src;
      video.currentTime = Math.min(segmentElapsed, videoDuration);
      video.loop = false;
      video.play().catch(() => {});
    }
  }, [audioRef, getSegmentIndex, videosReady, getCurrentVideo, timeline]);

  // Stop montage
  const stopMontage = useCallback(() => {
    videoARef.current?.pause();
    videoBRef.current?.pause();
    setIsPlaying(false);
    setActiveIndex(0);
    hasStartedRef.current = false;
    lastIndexRef.current = -1;
    lastSrcRef.current = '';
    transitionIdRef.current++;
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const onTimeUpdate = () => syncToAudio();
    const onPlay = () => {
      if (!hasStartedRef.current && isActive && videosReady) startMontage();
      const currentVideo = getCurrentVideo();
      if (currentVideo?.paused && currentVideo.src) {
        currentVideo.play().catch(() => {});
      }
    };
    const onPause = () => {
      videoARef.current?.pause();
      videoBRef.current?.pause();
    };
    const onSeeked = () => {
      if (timeline.length === 0) return;
      const time = audio.currentTime;
      const segmentIndex = getSegmentIndex(time);
      
      lastIndexRef.current = segmentIndex;
      lastSrcRef.current = ''; // Force switch on seek
      setActiveIndex(segmentIndex);
      switchToSegment(segmentIndex, time);
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
  }, [audioRef, syncToAudio, startMontage, isActive, getSegmentIndex, switchToSegment, videosReady, getCurrentVideo, timeline]);

  // Handle isActive changes
  useEffect(() => {
    if (isActive && !isPlaying && audioRef?.current && !audioRef.current.paused && videosReady && timeline.length > 0) {
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
  }, [isActive, isPlaying, startMontage, stopMontage, audioRef, videosReady, timeline]);

  // Initial mount check
  useEffect(() => {
    const audio = audioRef?.current;
    if (audio && !audio.paused && isActive && !hasStartedRef.current && videosReady && timeline.length > 0) {
      const timer = setTimeout(() => {
        if (!hasStartedRef.current) {
          startMontage();
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [audioRef, isActive, startMontage, videosReady, timeline]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy">
      {/* Double-buffered videos */}
      <video
        ref={videoARef}
        muted
        playsInline
        preload="auto"
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out",
          activeBuffer === 'A' ? "opacity-100 z-[2]" : "opacity-0 z-[1]"
        )}
      />
      <video
        ref={videoBRef}
        muted
        playsInline
        preload="auto"
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out",
          activeBuffer === 'B' ? "opacity-100 z-[2]" : "opacity-0 z-[1]"
        )}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-brand-navy/30 z-10" />
      
      {/* Progress dots */}
      {timeline.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
          {timeline.slice(0, 15).map((_, index) => (
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
      )}

      {/* Time display */}
      {isPlaying && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded text-sm font-mono">
          {displayTime}s / {audioDuration}s
        </div>
      )}
    </div>
  );
}
