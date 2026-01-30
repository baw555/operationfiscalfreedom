import { useRef, useState, useCallback, useEffect } from "react";

interface MontageSegment {
  src: string;
  startTime: number;
  endTime: number;
}

interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  activeSegmentIndex: number;
  phase: number;
  showMontage: boolean;
  autoplayBlocked: boolean;
  isStalled: boolean;
}

interface UseMontagePlaybackOptions {
  timeline: MontageSegment[];
  phaseTimeline: { phase: number; startTime: number }[];
  montageStartPhase: number;
  onPhaseChange?: (phase: number) => void;
  onSegmentChange?: (index: number) => void;
  debug?: boolean;
}

const DEBUG_KEY = "montage_debug";

export function useMontagePlayback({
  timeline,
  phaseTimeline,
  montageStartPhase,
  onPhaseChange,
  onSegmentChange,
  debug = false,
}: UseMontagePlaybackOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  
  const [state, setState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    activeSegmentIndex: 0,
    phase: 0,
    showMontage: false,
    autoplayBlocked: false,
    isStalled: false,
  });

  const initLockRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastSegmentRef = useRef(0);
  const lastPhaseRef = useRef(0);
  const preloadedRef = useRef<Set<string>>(new Set());
  const stallRecoveryRef = useRef<NodeJS.Timeout | null>(null);
  const healthCheckRef = useRef<NodeJS.Timeout | null>(null);

  const isDebug = debug || (typeof window !== "undefined" && new URLSearchParams(window.location.search).has(DEBUG_KEY));

  const log = useCallback((msg: string, data?: unknown) => {
    if (isDebug) {
      const ts = performance.now().toFixed(2);
      console.log(`[Montage ${ts}ms] ${msg}`, data ?? "");
    }
  }, [isDebug]);

  const getSegmentIndex = useCallback((time: number) => {
    for (let i = 0; i < timeline.length; i++) {
      if (time >= timeline[i].startTime && time < timeline[i].endTime) {
        return i;
      }
    }
    return timeline.length - 1;
  }, [timeline]);

  const getPhase = useCallback((time: number) => {
    for (let i = phaseTimeline.length - 1; i >= 0; i--) {
      if (time >= phaseTimeline[i].startTime) {
        return phaseTimeline[i].phase;
      }
    }
    return 1;
  }, [phaseTimeline]);

  const syncVideoToAudio = useCallback((forceSync = false) => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    const currentTime = audio.currentTime;
    const segmentIndex = getSegmentIndex(currentTime);
    const segment = timeline[segmentIndex];
    const video = videoRefs.current.get(segment.src);

    if (!video) return;

    const segmentElapsed = currentTime - segment.startTime;
    const videoDuration = video.duration || 10;
    const expectedVideoTime = segmentElapsed % videoDuration;
    const drift = Math.abs(video.currentTime - expectedVideoTime);

    if (forceSync || drift > 0.15) {
      log(`Drift correction: ${drift.toFixed(3)}s`, { expected: expectedVideoTime, actual: video.currentTime });
      
      if (drift > 0.5) {
        video.currentTime = expectedVideoTime;
      } else if (drift > 0.15) {
        video.playbackRate = video.currentTime < expectedVideoTime ? 1.05 : 0.95;
        setTimeout(() => { video.playbackRate = 1.0; }, 200);
      }
    }
  }, [timeline, getSegmentIndex, log]);

  const syncLoop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      rafRef.current = null;
      return;
    }

    if (audio.paused) {
      rafRef.current = null;
      return;
    }

    const currentTime = audio.currentTime;
    const newPhase = getPhase(currentTime);
    const newSegmentIndex = getSegmentIndex(currentTime);

    if (newPhase !== lastPhaseRef.current) {
      lastPhaseRef.current = newPhase;
      log(`Phase change: ${newPhase}`);
      setState(s => ({ 
        ...s, 
        phase: newPhase, 
        showMontage: newPhase >= montageStartPhase 
      }));
      onPhaseChange?.(newPhase);
    }

    if (newSegmentIndex !== lastSegmentRef.current) {
      const oldSegment = timeline[lastSegmentRef.current];
      const newSegment = timeline[newSegmentIndex];
      lastSegmentRef.current = newSegmentIndex;
      log(`Segment change: ${newSegmentIndex}`, { from: oldSegment?.src, to: newSegment?.src });

      videoRefs.current.forEach((video, src) => {
        if (src === newSegment.src) {
          const segmentElapsed = currentTime - newSegment.startTime;
          video.currentTime = segmentElapsed % (video.duration || 10);
          video.loop = true;
          if (video.paused) {
            video.play().catch(e => log("Video play failed", e));
          }
        } else {
          video.pause();
        }
      });

      setState(s => ({ ...s, activeSegmentIndex: newSegmentIndex, currentTime }));
      onSegmentChange?.(newSegmentIndex);

      const nextIndex = Math.min(newSegmentIndex + 1, timeline.length - 1);
      const nextSrc = timeline[nextIndex].src;
      if (!preloadedRef.current.has(nextSrc)) {
        const nextVideo = videoRefs.current.get(nextSrc);
        if (nextVideo) {
          nextVideo.preload = "auto";
          preloadedRef.current.add(nextSrc);
          log(`Preloading next segment: ${nextSrc}`);
        }
      }
    }

    syncVideoToAudio();
    setState(s => ({ ...s, currentTime }));
    rafRef.current = requestAnimationFrame(syncLoop);
  }, [timeline, montageStartPhase, getPhase, getSegmentIndex, syncVideoToAudio, onPhaseChange, onSegmentChange, log]);

  const ensureRAFRunning = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused && !rafRef.current) {
      log("RAF self-heal: restarting sync loop");
      rafRef.current = requestAnimationFrame(syncLoop);
    }
  }, [syncLoop, log]);

  const startPlayback = useCallback(async () => {
    if (initLockRef.current) {
      log("Start blocked: initialization in progress");
      return false;
    }

    initLockRef.current = true;
    log("Starting playback");

    const audio = audioRef.current;
    if (!audio) {
      initLockRef.current = false;
      log("No audio element");
      return false;
    }

    try {
      audio.currentTime = 0;
      await audio.play();
      
      setState(s => ({ ...s, isPlaying: true, autoplayBlocked: false, phase: 1 }));
      lastPhaseRef.current = 1;
      lastSegmentRef.current = 0;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(syncLoop);

      if (healthCheckRef.current) clearInterval(healthCheckRef.current);
      healthCheckRef.current = setInterval(ensureRAFRunning, 100);

      log("Playback started successfully");
      initLockRef.current = false;
      return true;
    } catch (e) {
      log("Autoplay blocked", e);
      setState(s => ({ ...s, autoplayBlocked: true }));
      initLockRef.current = false;
      return false;
    }
  }, [syncLoop, ensureRAFRunning, log]);

  const stopPlayback = useCallback(() => {
    log("Stopping playback");
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (healthCheckRef.current) {
      clearInterval(healthCheckRef.current);
      healthCheckRef.current = null;
    }

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    videoRefs.current.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });

    lastPhaseRef.current = 0;
    lastSegmentRef.current = 0;
    initLockRef.current = false;

    setState({
      isPlaying: false,
      currentTime: 0,
      activeSegmentIndex: 0,
      phase: 0,
      showMontage: false,
      autoplayBlocked: false,
      isStalled: false,
    });
  }, [log]);

  const handleStall = useCallback((video: HTMLVideoElement) => {
    log("Video stalled, attempting recovery");
    setState(s => ({ ...s, isStalled: true }));

    if (stallRecoveryRef.current) clearTimeout(stallRecoveryRef.current);

    stallRecoveryRef.current = setTimeout(() => {
      if (video.paused || video.readyState < 3) {
        video.currentTime = video.currentTime + 0.1;
        video.play().catch(() => {});
      }
      setState(s => ({ ...s, isStalled: false }));
    }, 500);
  }, [log]);

  const registerVideo = useCallback((src: string, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(src, el);
      
      el.addEventListener("stalled", () => handleStall(el));
      el.addEventListener("waiting", () => handleStall(el));
    }
  }, [handleStall]);

  const registerAudio = useCallback((el: HTMLAudioElement | null) => {
    if (el && el !== audioRef.current) {
      audioRef.current = el;

      el.addEventListener("play", () => {
        log("Audio play event");
        ensureRAFRunning();
      });

      el.addEventListener("pause", () => {
        log("Audio pause event");
        videoRefs.current.forEach(v => { if (!v.paused) v.pause(); });
      });

      el.addEventListener("ended", () => {
        log("Audio ended event");
        stopPlayback();
      });

      el.addEventListener("error", (e) => {
        log("Audio error", e);
      });
    }
  }, [ensureRAFRunning, stopPlayback, log]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (healthCheckRef.current) clearInterval(healthCheckRef.current);
      if (stallRecoveryRef.current) clearTimeout(stallRecoveryRef.current);
    };
  }, []);

  return {
    state,
    audioRef,
    registerAudio,
    registerVideo,
    startPlayback,
    stopPlayback,
    log,
  };
}
