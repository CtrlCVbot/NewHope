"use client";

import { useRef } from "react";
import Image from "next/image";
import type { V3Content } from "@/content/v3/types";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useReveal } from "../motion/useReveal";
import { CtaButton } from "../ui/CtaButton";
import { GlassCard } from "../ui/GlassCard";
import { richTextSegments } from "../ui/richTextSegments";
import styles from "./feature.module.css";

type Props = { feature: V3Content["feature"]; variant?: "design" | "saesomang" };

function Title({ value }: { value: V3Content["feature"]["title"] }) {
  return <h2 className={styles.title} data-feature-title aria-label={value.text}>{richTextSegments(value).map((segment, index) => segment.emphasized ? <em key={index}>{segment.text}</em> : <span key={index}>{segment.text}</span>)}</h2>;
}

function CardIntro({ value }: { value: V3Content["feature"]["cardIntro"] }) {
  return <p className={styles.cardIntro} data-feature-card-intro>{richTextSegments(value).map((segment, index) => segment.emphasized ? <em key={index}>{segment.text}</em> : <span key={index}>{segment.text}</span>)}</p>;
}

export function Feature({ feature, variant = "design" }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const isSaesomang = variant === "saesomang";
  useReveal(root, isSaesomang ? "[data-feature-copy], [data-feature-cta]" : "[data-feature-reveal]", reduced, { duration: 0.9, stagger: 0.1, y: 28, triggerSelector: isSaesomang ? "[data-feature-copy]" : undefined });
  useReveal(root, "[data-feature-card]", isSaesomang ? reduced : true, { duration: 0.9, stagger: 0.1, y: 28, triggerSelector: isSaesomang ? "[data-feature-card]" : undefined });

  const diagram = feature.image.kind === "diagram" || feature.image.kind === "decorative";
  return <section ref={root} className={`${styles.feature} ${diagram ? styles.diagramFeature : ""}`} data-v3-feature data-media-kind={feature.image.kind}>
    <div className={styles.background} data-feature-bg aria-hidden="true">
      <Image className={styles.backgroundImage} src={feature.image.src} alt="" fill sizes="100vw" priority={false} />
      {!diagram && <div className={styles.gradient} />}
    </div>
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <Title value={feature.title} />
        <p className={styles.body} data-feature-copy data-feature-reveal>{feature.body}</p>
        <CtaButton href={feature.cta.href} glow data-feature-cta data-feature-reveal>{feature.cta.label}</CtaButton>
      </div>
    </div>
    <div className={styles.cardWrapper}>
      <GlassCard className={styles.card} data-feature-card data-feature-reveal>
        <CardIntro value={feature.cardIntro} />
        <nav className={styles.pills} aria-label={feature.cardIntro.text}>
          {feature.pills.map((pill) => <a key={`${pill.href}-${pill.label}`} className={styles.pill} href={pill.href} data-feature-pill>{pill.label}</a>)}
        </nav>
      </GlassCard>
    </div>
  </section>;
}
