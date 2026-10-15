"use client";

import Image from "next/image";
import { useRef } from "react";
import type { V3Content } from "@/content/v3/types";
import { richTextSegments } from "../ui/richTextSegments";
import { useBlurReveal } from "../motion/useBlurReveal";
import { useParallax } from "../motion/useParallax";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useWordReveal } from "../motion/useWordReveal";
import styles from "./why.module.css";

type Props = { why: V3Content["why"]; brand: V3Content["brand"]; variant?: "design" | "saesomang" };

function wordsWithMasks(value: V3Content["why"]["title"]) {
  return richTextSegments(value).flatMap((segment, segmentIndex) => segment.text.split(/(\s+)/).map((word, wordIndex) => {
    if (!word.trim()) return word;
    return <span className={styles.wordMask} key={`${segmentIndex}-${wordIndex}`} aria-hidden="true"><span className={styles.word} data-why-word>{segment.emphasized ? <em>{word}</em> : word}</span></span>;
  }));
}

function blurWords(text: string, className: string) {
  return text.split(/(\s+)/).map((word, index) => word.trim() ? <span className={className} data-why-blur key={`${word}-${index}`}>{word}</span> : word);
}

export function Why({ why, brand, variant = "design" }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const isSaesomang = variant === "saesomang";
  useWordReveal(root, isSaesomang ? "[data-why-logo-reveal]" : "[data-why-word], [data-why-logo-reveal]", reduced, { duration: 1, stagger: 0.06 });
  useWordReveal(root, "[data-why-word]", isSaesomang ? reduced : true, { duration: 1, stagger: 0.06, triggerSelector: isSaesomang ? "[data-why-title]" : undefined });
  useBlurReveal(root, isSaesomang ? "[data-why-body] [data-why-blur]" : "[data-why-blur]", reduced, { duration: 0.9, stagger: 0.035, y: 30, blur: 12, triggerSelector: isSaesomang ? "[data-why-body]" : undefined });
  useBlurReveal(root, "[data-why-footnote] [data-why-blur]", isSaesomang ? reduced : true, { duration: 0.9, stagger: 0.035, y: 30, blur: 12, triggerSelector: isSaesomang ? "[data-why-footnote]" : undefined });
  const diagram = why.image.kind === "diagram" || why.image.kind === "decorative";
  useParallax(root, diagram ? "[data-why-diagram-static]" : "[data-why-image]", reduced, { amount: -20 });

  return <section ref={root} className={`${styles.why} ${diagram ? styles.diagramWhy : ""}`} data-v3-why data-media-kind={why.image.kind}>
    <div className={styles.background} aria-hidden="true"><Image src={why.image.src} alt="" fill sizes="100vw" {...(!diagram ? { "data-why-image": true } : {})} />{!diagram && <div className={styles.gradient} />}</div>
    <div className={styles.logo} data-why-logo><Image src={brand.wordmarkSvg} alt={brand.name} fill sizes="(max-width: 450px) 240px, (max-width: 890px) 512px, 869px" data-why-logo-reveal /></div>
    <div className={styles.content}>
      <div className={styles.textWrap}>
        <h2 className={styles.title} data-why-title aria-label={why.title.text}>{wordsWithMasks(why.title)}</h2>
        <p className={styles.body} data-why-body>{blurWords(why.body, styles.blurWord)}</p>
      </div>
      <p className={styles.footnote} data-why-footnote>{blurWords(why.footnote, styles.blurWord)}</p>
    </div>
  </section>;
}
