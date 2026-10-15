"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import Image from "next/image";
import type { V3Content } from "@/content/v3/types";
import { useReducedMotion } from "../motion/useReducedMotion";
import { GoldLabel } from "../ui/GoldLabel";
import styles from "./saesomang-care.module.css";

type Props = { id: string; care: V3Content["care"] };
const ROTATION_MS = 5000;

export function SaesomangCareTabs({ id, care }: Props) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement[]>([]);
  const elapsed = useRef(0);
  const startedAt = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [desktopControls, setDesktopControls] = useState(false);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [playbackIntent, setPlaybackIntent] = useState(true);
  const reduced = useReducedMotion();
  const count = care.tabs.length;
  const automaticAvailable = desktopControls && reduced === false && count > 1;
  const running = automaticAvailable && playbackIntent && visible && documentVisible && !pointerPaused && !focusPaused;

  const resetProgress = useCallback(() => {
    elapsed.current = 0;
    startedAt.current = null;
    progress.current.forEach((line) => { line.style.transform = "scaleX(0)"; });
  }, []);

  const select = useCallback((index: number, manual = true) => {
    if (!count) return;
    resetProgress();
    if (manual) setPlaybackIntent(false);
    setActive((index + count) % count);
  }, [count, resetProgress]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 961px) and (hover: hover) and (pointer: fine)");
    const update = () => setDesktopControls(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

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
    if (!running) return;
    let frame = 0;
    const tick = (now: number) => {
      startedAt.current ??= now;
      const ratio = Math.min((elapsed.current + now - startedAt.current) / ROTATION_MS, 1);
      const line = progress.current[active];
      if (line) line.style.transform = `scaleX(${ratio})`;
      if (ratio === 1) {
        select(active + 1, false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      if (startedAt.current !== null) elapsed.current = Math.min(elapsed.current + performance.now() - startedAt.current, ROTATION_MS);
      startedAt.current = null;
    };
  }, [active, running, select]);

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

  const togglePlayback = (event: MouseEvent<HTMLButtonElement>) => {
    resetProgress();
    setPlaybackIntent((value) => !value);
    if (event.detail > 0) event.currentTarget.blur();
  };
  const pointerEnter = (event: PointerEvent<HTMLElement>) => { if (event.pointerType === "mouse") setPointerPaused(true); };
  const pointerLeave = (event: PointerEvent<HTMLElement>) => { if (event.pointerType === "mouse") setPointerPaused(false); };

  return <section id={id} ref={root} className={styles.care} data-v3-care data-care-rotation={care.rotation ?? "responsive"} data-care-running={String(running)} onPointerEnter={pointerEnter} onPointerLeave={pointerLeave} onFocusCapture={() => setFocusPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false); }}>
    <div className={styles.wrapper}>
      <div className={styles.images}>
        {care.tabs.map((tab, index) => <div key={tab.text} className={styles.image} data-care-image aria-hidden={index !== active}>
          <Image src={tab.image.src} alt={index === active ? tab.image.alt : ""} fill sizes="(max-width: 960px) calc(100vw - 4rem), 560px" />
        </div>)}
      </div>
      <div className={styles.content}>
        <GoldLabel className={styles.label}>{care.label}</GoldLabel>
        {care.title && <h2 className={styles.title}>{care.title.text}</h2>}
        <div className={styles.tabs} role="tablist" aria-label={care.label} aria-orientation="vertical" data-care-current={active}>
          {care.tabs.map((tab, index) => <button key={tab.text} id={`${id}-tab-${index}`} className={styles.tab} type="button" role="tab" aria-selected={index === active} aria-controls={`${id}-panel-${index}`} tabIndex={index === active ? 0 : -1} data-care-tab data-care-tab-index={index} onClick={() => select(index)} onKeyDown={(event) => onKeyDown(event, index)}>
            <span>{tab.text}</span><span className={styles.progress} aria-hidden="true"><span ref={(element) => { if (element) progress.current[index] = element; }} data-care-progress /></span>
          </button>)}
        </div>
        <div className={styles.panels}>
          {care.tabs.map((tab, index) => <div key={tab.text} id={`${id}-panel-${index}`} className={styles.panel} data-care-panel role="tabpanel" aria-labelledby={`${id}-tab-${index}`} aria-hidden={index !== active}><p>{tab.body}</p></div>)}
        </div>
        {automaticAvailable && <button type="button" className={styles.playback} data-care-playback onClick={togglePlayback}>{playbackIntent ? "자동 전환 정지" : "자동 전환 재생"}</button>}
      </div>
      <noscript><style>{`[data-v3-care] [role="tablist"],[data-v3-care] [data-care-playback]{display:none}`}</style><div className={styles.noScript} data-care-noscript><p>{care.label}</p><ul>{care.tabs.map((tab) => <li key={tab.text}><strong>{tab.text}</strong><span>{tab.body}</span></li>)}</ul></div></noscript>
    </div>
  </section>;
}
