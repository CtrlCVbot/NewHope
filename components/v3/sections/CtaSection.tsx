"use client";

import { useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import type { V3Content } from "@/content/v3/types";
import { GoldLabel } from "../ui/GoldLabel";
import { RichText } from "../ui/RichText";
import { CtaButton } from "../ui/CtaButton";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useWordReveal } from "../motion/useWordReveal";
import styles from "./cta-section.module.css";

type Props = { id: string; cta: V3Content["cta"]; children?: ReactNode };

export function CtaSection({ id, cta, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [spotlight, setSpotlight] = useState(false);
  useWordReveal(root, "[data-cta-section-heading]", reduced, { duration: 1, stagger: 0.06 });

  const moveSpotlight = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    setSpotlight(true);
  };

  return <section id={id} ref={root} className={styles.cta} data-v3-cta-section data-spotlight={spotlight || undefined} onPointerMove={moveSpotlight} onPointerLeave={() => setSpotlight(false)}>
    <div className={styles.texture} data-cta-section-spotlight aria-hidden="true" />
    <div className={styles.content}>
      <GoldLabel className={styles.label}>{cta.label}</GoldLabel>
      <div className={styles.headingMask}><h2 className={styles.heading} data-cta-section-heading aria-label={cta.title.text}><RichText value={cta.title} tone="cta" /></h2></div>
      <p className={styles.body} data-cta-section-body>{cta.body}</p>
      <div className={styles.buttonHolder}><CtaButton href={cta.button.href} glow data-cta-section-button>{cta.button.label}</CtaButton></div>
      {children}
    </div>
  </section>;
}
