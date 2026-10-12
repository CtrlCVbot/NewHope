"use client";
import { useEffect, useState } from "react";
import { useSmoothScroll } from "./SmoothScroll";
import styles from "./frame.module.css";
export function ScrollTop() {
  const [visible, setVisible] = useState(false); const { lenis, reducedMotion } = useSmoothScroll();
  useEffect(() => { let previous = window.scrollY; const update = () => { const current = window.scrollY; setVisible(current > 300 && current < previous); previous = current; }; update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  const scrollToTop = () => { if (lenis) lenis.scrollTo(0, { immediate: reducedMotion }); else window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }); };
  return <button type="button" className={`${styles.scrollTop} ${visible ? styles.visible : ""}`} data-v3-scroll-top aria-label="페이지 맨 위로" tabIndex={visible ? 0 : -1} onClick={scrollToTop}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="m7 14 5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>;
}
