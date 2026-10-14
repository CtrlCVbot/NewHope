"use client";

import { useEffect, useRef, useState } from "react";
import type { V3Content } from "@/content/v3/types";
import { getV3Gsap } from "../motion/gsap";
import { useReducedMotion } from "../motion/useReducedMotion";
import styles from "./process.module.css";

type Props = { process: V3Content["process"]; id: string; showNote?: boolean };

export function Process({ process, id, showNote = false }: Props) {
  const root = useRef<HTMLElement>(null);
  const steps = useRef<Array<HTMLButtonElement | null>>([]);
  const progressColumn = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  const [geometry, setGeometry] = useState({ progress: 0, markerOffsets: [] as number[], trackTop: 0, trackHeight: 0 });
  const reduced = useReducedMotion();
  const stepCount = process.steps.length;

  useEffect(() => {
    const element = root.current;
    if (!element || reduced === null || stepCount === 0) return;
    let cancelled = false;
    let frame = 0;
    let lastStep = 0;
    let resizeObserver: ResizeObserver | undefined;
    let scheduleUpdate: () => void = () => undefined;
    const { gsap, ScrollTrigger } = getV3Gsap();
    const context = gsap.context(() => {
      const updateCurrentStep = () => {
        frame = 0;
        if (cancelled) return;
        const viewportCenter = window.innerHeight / 2;
        const column = progressColumn.current;
        if (!column) return;
        const columnRect = column.getBoundingClientRect();
        const centers: number[] = [];
        let closest = 1;
        let closestDistance = Number.POSITIVE_INFINITY;
        steps.current.forEach((step, index) => {
          if (!step) return;
          const rect = step.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          centers[index] = center;
          const distance = Math.abs(center - viewportCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closest = index + 1;
          }
        });
        if (closest !== lastStep) {
          lastStep = closest;
          setCurrent(closest);
        }
        const firstCenter = centers[0];
        const lastCenter = centers[centers.length - 1];
        if (firstCenter === undefined || lastCenter === undefined) return;
        const range = Math.max(lastCenter - firstCenter, 1);
        const progress = Math.min(1, Math.max(0, (viewportCenter - firstCenter) / range));
        const markerOffsets = centers.map((center) => center - columnRect.top);
        const trackTop = markerOffsets[0];
        const trackHeight = Math.max(markerOffsets[markerOffsets.length - 1] - trackTop, 0);
        setGeometry((previous) => {
          const changed = Math.abs(previous.progress - progress) > 0.001
            || previous.trackTop !== trackTop || previous.trackHeight !== trackHeight
            || previous.markerOffsets.length !== markerOffsets.length
            || previous.markerOffsets.some((offset, index) => offset !== markerOffsets[index]);
          return changed ? { progress, markerOffsets, trackTop, trackHeight } : previous;
        });
      };
      scheduleUpdate = () => {
        if (cancelled || frame) return;
        frame = requestAnimationFrame(updateCurrentStep);
      };

      ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        onEnter: scheduleUpdate,
        onEnterBack: scheduleUpdate,
        onUpdate: scheduleUpdate,
        onRefresh: scheduleUpdate,
      });
      scheduleUpdate();

      resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(element);
      window.addEventListener("resize", scheduleUpdate);

    }, element);

    // Font loading can change the tall step measurements after hydration.
    if (document.fonts) void document.fonts.ready.then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      scheduleUpdate();
    });

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      context.revert();
    };
  }, [reduced, stepCount]);

  const selectStep = (index: number) => {
    const target = steps.current[index];
    if (!target) return;
    setCurrent(index + 1);
    target.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" });
  };

  const progress = geometry.progress * 100;
  const hasMeasuredGeometry = geometry.markerOffsets.length === stepCount;
  return <section id={id} ref={root} className={styles.process} data-v3-process aria-label={process.title.text}>
    <div className={styles.approach}>
      <div className={styles.grid}>
        <header className={styles.stickySide}>
          <h2 className={styles.heading}>{process.title.text}</h2>{showNote && <p className={styles.note}>{process.note}</p>}
          <div className={styles.numberDisplay} data-process-number aria-hidden="true"><span>0</span><span className={styles.numberScroll}><span className={styles.numberWrapper} style={{ transform: `translateY(calc(var(--number-row-height) * -${current - 1}))` }}>{process.steps.map((_, index) => <span key={index}>{index + 1}.</span>)}</span></span></div>
        </header>
        <div ref={progressColumn} className={styles.progressColumn} aria-hidden="true">
          <div className={styles.progressTrack} style={hasMeasuredGeometry ? { top: geometry.trackTop, height: geometry.trackHeight, bottom: "auto" } : undefined}><div className={styles.progressFill} data-process-progress style={{ transform: `scaleY(${geometry.progress})` }} /></div>
          {process.steps.map((_, index) => <span key={index} className={styles.marker} data-process-marker data-active={index + 1 <= current || undefined} style={{ top: hasMeasuredGeometry ? geometry.markerOffsets[index] : `${(index / Math.max(stepCount - 1, 1)) * 100}%` }} />)}
        </div>
        <div className={styles.steps} role="region" aria-label={process.note}>
          <div className={styles.srOnly} role="progressbar" aria-label={process.note} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-valuetext={`${current} / ${stepCount}, ${Math.round(progress)}%`} />
          {process.steps.map((step, index) => {
            const active = current === index + 1;
            return <button key={`${step.title}-${index}`} ref={(node) => { steps.current[index] = node; }} type="button" className={styles.step} data-process-step data-active={active || undefined} aria-current={active ? "step" : undefined} onClick={() => selectStep(index)}>
              <span className={styles.stepTitle}><span className={styles.stepNumber}>0{index + 1}</span>{step.title}</span>
              <span className={styles.stepDescription}>{step.description}</span>
            </button>;
          })}
        </div>
      </div>
    </div>
  </section>;
}
