"use client";

import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { ConsultationGuide as ConsultationGuideData } from "@/content/v3/types";
import { CtaButton } from "../ui/CtaButton";
import { GoldLabel } from "../ui/GoldLabel";
import { RichText } from "../ui/RichText";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useWordReveal } from "../motion/useWordReveal";
import styles from "./saesomang-consultation.module.css";

type Props = { id: string; guide: ConsultationGuideData };

export function SaesomangConsultation({ id, guide }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [spotlight, setSpotlight] = useState(false);
  useWordReveal(root, "[data-cta-section-heading]", reduced, { duration: 0.9, stagger: 0.06 });
  const moveSpotlight = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    setSpotlight(true);
  };
  const noticeId = `${id}-notice`;
  return <section id={id} ref={root} className={styles.cta} data-v3-cta-section data-spotlight={spotlight || undefined} onPointerMove={moveSpotlight} onPointerLeave={() => setSpotlight(false)}>
    <span id="consult" className={styles.alias} data-consult-alias aria-hidden="true" />
    <div className={styles.texture} data-cta-section-spotlight aria-hidden="true" />
    <div className={styles.content}>
      <GoldLabel className={styles.label}>{guide.label}</GoldLabel>
      <div className={styles.headingMask}><h2 className={styles.heading} data-cta-section-heading aria-label={guide.title.text}><RichText value={guide.title} tone="cta" /></h2></div>
      <p className={styles.body} data-cta-section-body>{guide.body}</p>
      <div className={styles.buttonHolder}><CtaButton href={guide.button.href} glow aria-describedby={noticeId} data-cta-section-button data-v3-consult-button>{guide.button.label}</CtaButton></div>
      <p id={noticeId} className={styles.notice} data-v3-consult aria-label={guide.label}>{guide.notice}</p>
    </div>
  </section>;
}
