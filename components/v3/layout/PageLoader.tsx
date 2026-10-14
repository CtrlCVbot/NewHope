"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { getV3Gsap } from "../motion/gsap";
import styles from "./loader.module.css";

type Props = { brand: { name: string; tagline: string }; onStart: () => void; onComplete: () => void; storageKey?: string };

export function PageLoader({ brand, onStart, onComplete, storageKey = "v3-design-pageLoaded" }: Props) {
  const [reduced, setReduced] = useState<boolean | null>(null);
  const [show, setShow] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const completed = useRef(false);
  const complete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced === null || completed.current) return;
    const finish = () => complete();
    if (reduced) { finish(); return; }
    try {
      if (sessionStorage.getItem(storageKey)) { finish(); return; }
      sessionStorage.setItem(storageKey, "1");
    } catch { finish(); return; }
    const start = window.setTimeout(() => { onStart(); setShow(true); }, 0);
    return () => window.clearTimeout(start);
  }, [complete, onStart, reduced, storageKey]);

  useEffect(() => {
    if (!show || !reduced) return;
    const finish = window.setTimeout(() => { setShow(false); complete(); }, 0);
    return () => window.clearTimeout(finish);
  }, [complete, reduced, show]);

  useGSAP(() => {
    if (!show || reduced) return;
    const { gsap } = getV3Gsap();
    const scale = Math.max(window.innerWidth / 571, window.innerHeight / 800) * 1.2;
    const timeline = gsap.timeline({ onComplete: () => { setShow(false); complete(); } });
    timeline.to(windowRef.current, { scale, duration: .8, ease: "power2.inOut" })
      .to(wordmarkRef.current, { y: -300, autoAlpha: 0, duration: .6, ease: "power2.in" }, 0)
      .to(root.current, { autoAlpha: 0, duration: .3, ease: "power2.out" });
  }, { scope: root, dependencies: [show, reduced], revertOnUpdate: true });

  if (!show) return null;
  return <div ref={root} className={styles.loader} data-v3-loader data-phase="loading" aria-hidden="true">
    <div ref={windowRef} className={styles.window} />
    <p ref={wordmarkRef} className={styles.wordmark}>{brand.name}<small>{brand.tagline}</small></p>
  </div>;
}
