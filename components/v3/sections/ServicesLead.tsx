"use client";

import Image from "next/image";
import { useRef } from "react";
import type { V3Content } from "@/content/v3/types";
import { GoldLabel } from "../ui/GoldLabel";
import { LeafList } from "../ui/LeafList";
import { richTextSegments } from "../ui/richTextSegments";
import { useBlurReveal } from "../motion/useBlurReveal";
import { useMaskReveal } from "../motion/useMaskReveal";
import { useParallax } from "../motion/useParallax";
import { useWordReveal } from "../motion/useWordReveal";
import styles from "./services.module.css";

type Props = Pick<V3Content["services"], "label" | "headline" | "points" | "image"> & { reduced: boolean | null };

function headlineWords(headline: V3Content["services"]["headline"]) {
  return richTextSegments(headline).flatMap((segment, segmentIndex) => segment.text.split(/(\s+)/).map((word, wordIndex) => {
    if (!word.trim()) return word;
    const content = segment.emphasized ? <em>{word}</em> : word;
    return <span className={styles.wordMask} key={`${segmentIndex}-${wordIndex}`} aria-hidden="true"><span className={styles.word} data-services-word>{content}</span></span>;
  }));
}

export function ServicesLead({ label, headline, points, image, reduced }: Props) {
  const root = useRef<HTMLDivElement>(null);
  useBlurReveal(root, "[data-services-lead-blur]", reduced, { duration: 0.9, stagger: 0.1, y: 30, blur: 12 });
  useWordReveal(root, "[data-services-word]", reduced, { duration: 1, stagger: 0.06 });
  const diagram = image.kind === "diagram" || image.kind === "decorative";
  useMaskReveal(root, diagram ? "[data-services-diagram-static]" : "[data-services-image-mask]", reduced, { axis: "x", duration: 1.2 });
  useParallax(root, diagram ? "[data-services-diagram-static]" : "[data-services-image]", reduced, { amount: -20 });

  return <div ref={root} className={`${styles.lead} ${diagram ? styles.diagramLead : ""}`} data-services-lead data-media-kind={image.kind}>
    <div className={styles.leadCopy}>
      <GoldLabel className={styles.label} data-services-lead-blur>{label}</GoldLabel>
      <h3 aria-label={headline.text}>{headlineWords(headline)}</h3>
      <LeafList className={styles.points} aria-label={`${label} 안내`} items={points.slice(0, 3).map((point) => <span data-services-lead-blur key={point}>{point}</span>)} />
    </div>
    <div className={styles.leadImageMask} {...(!diagram ? { "data-services-image-mask": true } : {})}>
      <Image className={styles.leadImage} {...(!diagram ? { "data-services-image": true } : {})} src={image.src} alt={image.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />
      {!diagram && <div className={styles.imageShade} aria-hidden="true" />}
    </div>
  </div>;
}
