"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { getV3Gsap } from "../motion/gsap";
import { useReducedMotion } from "../motion/useReducedMotion";

type SmoothScrollContextValue = {
  lenis: Lenis | null;
  reducedMotion: boolean;
  setScrollLocked: (locked: boolean) => void;
};
const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenis: null, reducedMotion: false, setScrollLocked: () => {} });
export function useSmoothScroll() { return useContext(SmoothScrollContext); }

export function SmoothScrollProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const active = useRef<Lenis | null>(null);
  const scrollLocked = useRef(false);
  const setScrollLocked = useCallback((locked: boolean) => {
    scrollLocked.current = locked;
    const instance = active.current;
    if (locked) instance?.stop();
    else { instance?.resize(); instance?.start(); }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const prior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    return () => { html.style.scrollBehavior = prior; };
  }, []);

  useGSAP(() => {
    if (reduced !== false) { setLenis(null); return; }
    const { gsap, ScrollTrigger } = getV3Gsap();
    const instance = new Lenis({ autoRaf: false, lerp: 0.1, syncTouch: false, anchors: true });
    const update = () => ScrollTrigger.update();
    const tick = (time: number) => instance.raf(time * 1000);
    active.current = instance;
    if (scrollLocked.current) instance.stop();
    instance.on("scroll", update);
    gsap.ticker.add(tick);
    setLenis(instance);
    return () => {
      // Clear ownership before destroy: menu cleanup must never restart a stale instance.
      active.current = null;
      gsap.ticker.remove(tick);
      instance.off("scroll", update);
      instance.destroy();
      setLenis(null);
    };
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  return <SmoothScrollContext.Provider value={{ lenis, reducedMotion: reduced === true, setScrollLocked }}><div ref={root}>{children}</div></SmoothScrollContext.Provider>;
}
