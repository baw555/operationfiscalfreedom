import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MontageItem {
  type: "image" | "video";
  src: string;
  alt?: string;
}

const montageItems: MontageItem[] = [
  { type: "video", src: "/videos/soldiers-marching-new.mp4", alt: "Soldiers marching in formation" },
  { type: "image", src: "/images/montage-salute.png", alt: "Military salute ceremony" },
  { type: "image", src: "/images/montage-rain.png", alt: "Soldiers marching in rain" },
  { type: "image", src: "/images/montage-gear.png", alt: "Military gear and equipment" },
  { type: "image", src: "/images/montage-march.png", alt: "Soldiers on patrol" },
  { type: "image", src: "/images/montage-helicopter.png", alt: "Soldiers in helicopter" },
  { type: "video", src: "/videos/montage-clip.mp4", alt: "Military action clip" },
];

const SLIDE_DURATION = 3000;

export function HeroMontage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % montageItems.length);
        setIsTransitioning(false);
      }, 800);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentItem = montageItems[currentIndex];
    if (currentItem.type === "video") {
      const videoEl = videoRefs.current[currentIndex];
      if (videoEl) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
      }
    }
  }, [currentIndex]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {montageItems.map((item, index) => {
        const isActive = index === currentIndex;
        const isPrev = index === (currentIndex - 1 + montageItems.length) % montageItems.length;
        
        return (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out",
              isActive && !isTransitioning ? "opacity-100 scale-100" : "",
              isActive && isTransitioning ? "opacity-0 scale-105" : "",
              !isActive && isPrev && isTransitioning ? "opacity-100 scale-100" : "",
              !isActive && !isPrev ? "opacity-0 scale-110" : ""
            )}
            style={{
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
            }}
          >
            {item.type === "image" ? (
              <div
                className="w-full h-full bg-cover bg-center animate-ken-burns"
                style={{ 
                  backgroundImage: `url(${item.src})`,
                }}
              />
            ) : (
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={item.src}
                muted
                playsInline
                loop={false}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        );
      })}
      
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-brand-navy/40 z-10" />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {montageItems.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-500",
              index === currentIndex 
                ? "bg-brand-gold w-6" 
                : "bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
