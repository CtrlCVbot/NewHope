"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { KeyboardEvent } from "react";
import type { V3Content } from "@/content/v3/types";
import { useReducedMotion } from "../motion/useReducedMotion";
import { GoldLabel } from "../ui/GoldLabel";
import styles from "./care.module.css";

type Props = { id: string; care: V3Content["care"]; showMedia?: boolean };
const ROTATION_MS = 3000;

export function CareTabs({ id, care, showMedia = true }: Props) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement[]>([]);
  const elapsed = useRef(0);
  const startedAt = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [rotationKey, setRotationKey] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pausedByPointer, setPausedByPointer] = useState(false);
  const [pausedByFocus, setPausedByFocus] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const reduced = useReducedMotion();
  const count = care.tabs.length;
  const manual = care.rotation === "manual";
  const canRotate = !manual && count > 1 && visible && !pausedByPointer && !pausedByFocus && documentVisible && reduced === false;

  const resetProgress = useCallback(() => {
    elapsed.current = 0;
    startedAt.current = null;
    progress.current.forEach((line) => { line.style.transform = "scaleX(0)"; });
  }, []);

  const select = useCallback((index: number) => {
    if (!count) return;
    resetProgress();
    setRotationKey((value) => value + 1);
    setActive((index + count) % count);
  }, [count, resetProgress]);

  useEffect(() => {
    const element = root.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.3), { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (!visible) resetProgress();
  }, [visible, resetProgress]);

  useEffect(() => {
    if (!canRotate) return;
    let frame = 0;
    const tick = (now: number) => {
      startedAt.current ??= now;
      const ratio = Math.min((elapsed.current + now - startedAt.current) / ROTATION_MS, 1);
      const line = progress.current[active];
      if (line) line.style.transform = `scaleX(${ratio})`;
      if (ratio === 1) { select(active + 1); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      if (startedAt.current !== null) elapsed.current = Math.min(elapsed.current + performance.now() - startedAt.current, ROTATION_MS);
      startedAt.current = null;
    };
  }, [active, canRotate, rotationKey, select]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = index + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = count - 1;
    if (next === null) return;
    event.preventDefault();
    const target = (next + count) % count;
    select(target);
    root.current?.querySelector<HTMLButtonElement>(`[data-care-tab-index="${target}"]`)?.focus();
  };

  return <section id={id} ref={root} className={`${styles.care} ${manual ? styles.manualCare : ""}`} data-v3-care data-care-rotation={care.rotation ?? "auto"} onPointerEnter={() => setPausedByPointer(true)} onPointerLeave={() => setPausedByPointer(false)} onFocusCapture={() => setPausedByFocus(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPausedByFocus(false); }}>
    <div className={`${styles.wrapper} ${!showMedia ? styles.compactCare : ""}`}>
      {showMedia && <div className={styles.images} aria-live="polite">
        {care.tabs.map((tab, index) => <div key={tab.text} {...(!manual ? { id: `${id}-panel-${index}`, "data-care-panel": true, role: "tabpanel", "aria-labelledby": `${id}-tab-${index}` } : {})} className={[styles.image, index === active ? styles.activeImage : "", tab.image.kind === "diagram" ? styles.diagram : ""].filter(Boolean).join(" ")} data-care-image data-media-kind={tab.image.kind} aria-hidden={index !== active}>
          <Image src={tab.image.src} alt={index === active ? tab.image.alt : ""} fill sizes="(max-width: 600px) 100vw, 50vw" />
          {tab.image.kind !== "diagram" && <div className={styles.gradient} aria-hidden="true" />}
        </div>)}
      </div>}
      <div className={styles.content}>
        <div className={styles.text}>
          <GoldLabel className={styles.label}>{care.label}</GoldLabel>
          <div className={styles.tabs} role="tablist" aria-label={care.label} data-care-current={active}>
            {care.tabs.map((tab, index) => <button key={tab.text} id={`${id}-tab-${index}`} className={[styles.tab, index === active ? styles.activeTab : ""].filter(Boolean).join(" ")} type="button" role="tab" aria-selected={index === active} aria-controls={`${id}-panel-${index}`} tabIndex={index === active ? 0 : -1} data-care-tab data-care-tab-index={index} onClick={() => select(index)} onKeyDown={(event) => onKeyDown(event, index)}>
              <span className={styles.tabText}>{tab.text}</span>{!manual && <span className={styles.progress} aria-hidden="true"><span ref={(element) => { if (element) progress.current[index] = element; }} className={styles.progressLine} data-care-progress /></span>}
            </button>)}
          </div>
          {manual && <div className={styles.panels}>
            {care.tabs.map((tab, index) => <div key={tab.text} id={`${id}-panel-${index}`} className={styles.panel} data-care-panel role="tabpanel" aria-labelledby={`${id}-tab-${index}`} aria-hidden={index !== active} hidden={index !== active}>
              <p>{tab.body}</p>
            </div>)}
          </div>}
        </div>
      </div>
      {manual && <noscript><div className={styles.noScript} data-care-noscript><p>{care.label}</p><ul>{care.tabs.map((tab) => <li key={tab.text}><strong>{tab.text}</strong><span>{tab.body}</span></li>)}</ul></div></noscript>}
    </div>
  </section>;
}
