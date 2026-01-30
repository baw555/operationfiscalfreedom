import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface MontageSegment {
  src: string;
  startTime: number;
  endTime: number;
}

export const montageTimeline: MontageSegment[] = [
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

export const uniqueVideos = Array.from(new Set(montageTimeline.map(s => s.src)));

interface HeroMontageProps {
  isActive: boolean;
  activeSegmentIndex: number;
  currentTime: number;
  audioDuration: number;
  registerVideo: (src: string, el: HTMLVideoElement | null) => void;
}

export function HeroMontage({ 
  isActive, 
  activeSegmentIndex, 
  currentTime,
  audioDuration,
  registerVideo 
}: HeroMontageProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy">
      {uniqueVideos.map((src, i) => (
        <video
          key={src}
          ref={el => registerVideo(src, el)}
          src={src}
          muted
          playsInline
          preload={i < 2 ? "auto" : "metadata"}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out",
            montageTimeline[activeSegmentIndex]?.src === src ? "opacity-100" : "opacity-0"
          )}
          style={{ zIndex: montageTimeline[activeSegmentIndex]?.src === src ? 1 : 0 }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-brand-navy/30 z-10" />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
        {montageTimeline.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300",
              index === activeSegmentIndex 
                ? "bg-brand-gold w-4 sm:w-6" 
                : index < activeSegmentIndex
                  ? "bg-white/60"
                  : "bg-white/30"
            )}
          />
        ))}
      </div>

      {isActive && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded text-sm font-mono">
          {Math.floor(currentTime)}s / {audioDuration}s
        </div>
      )}
    </div>
  );
}
