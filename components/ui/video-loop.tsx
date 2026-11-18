"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Lazy, muted, looping video. Loads only near the viewport; still poster under reduced motion. */
export function VideoLoop({
  name,
  label,
  width,
  height,
  className = "",
}: {
  name: string;
  label: string;
  width: number;
  height: number;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <video
      ref={ref}
      className={className}
      width={width}
      height={height}
      poster={`/video/${name}-poster.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    >
      {load && <source src={`/video/${name}.webm`} type="video/webm" />}
      {load && <source src={`/video/${name}.mp4`} type="video/mp4" />}
    </video>
  );
}
