"use client";

import { useRef } from "react";
import Image from "next/image";
import type { V3Content } from "@/content/v3/types";
import { richTextSegments } from "../ui/richTextSegments";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useReveal } from "../motion/useReveal";
import { useWordReveal } from "../motion/useWordReveal";
import { useMaskReveal } from "../motion/useMaskReveal";
import { useParallax } from "../motion/useParallax";
import styles from "./intro.module.css";

type Props = { intro: V3Content["intro"]; id: string; variant?: "design" | "saesomang" };

function Headline({ value }: { value: V3Content["intro"]["headline"] }) {
  return <h2 className={styles.headline} data-intro-headline aria-label={value.text}>{richTextSegments(value).flatMap((segment, segmentIndex) => segment.text.split(/(\s+)/).map((part, partIndex) => {
    if (/^\s+$/.test(part)) return part;
    return <span className={styles.wordMask} key={`${segmentIndex}-${partIndex}`} aria-hidden="true"><span className={segment.emphasized ? styles.emphasis : undefined} data-intro-emphasis={segment.emphasized || undefined} data-intro-word>{part}</span></span>;
  }))}</h2>;
}

export function Intro({ intro, id, variant = "design" }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const isSaesomang = variant === "saesomang";
  useReveal(root, "[data-intro-reveal]", reduced, { duration: 1, stagger: 0.1, y: 32, perTarget: isSaesomang });
  useReveal(root, "[data-intro-figure-reveal]", reduced, { duration: 0.8, stagger: 0, y: 24, perTarget: true });
  useWordReveal(root, "[data-intro-word]", reduced, { duration: 1, stagger: 0.06, triggerSelector: isSaesomang ? "[data-intro-headline]" : undefined });
  useMaskReveal(root, "[data-intro-mask-y]", reduced, { axis: "y" });
  useMaskReveal(root, "[data-intro-mask-x]", reduced, { axis: "x" });
  useParallax(root, "[data-intro-parallax]", reduced, { amount: -20 });
  const image = intro.images[0];
  return <section id={id} ref={root} className={`${styles.intro} ${isSaesomang ? styles.saesomangIntro : ""}`} data-v3-intro>
    <div className={styles.blurTop} aria-hidden="true" /><div className={styles.blurBottom} aria-hidden="true" /><div className={styles.spotlightLeft} aria-hidden="true" /><div className={styles.spotlightBody} aria-hidden="true" />
    <div className={styles.container}>
      <header className={styles.header}><p className={styles.label} data-intro-label data-intro-reveal>{intro.label}</p><Headline value={intro.headline} /></header>
      {isSaesomang ? <div className={styles.saesomangGrid}>
        <div className={styles.saesomangCopy} data-intro-reveal><p className={styles.body} data-intro-body>{intro.body}</p>{intro.details && <dl className={styles.details}>{intro.details.map((detail) => <div key={detail.term}><dt>{detail.term}</dt><dd>{detail.description}</dd></div>)}</dl>}</div>
        {image && <figure className={styles.saesomangImage} data-intro-image="primary" data-intro-figure-reveal><Image src={image.src} alt={image.alt} width={480} height={402} sizes="(max-width: 768px) calc(100vw - 48px), 480px" /></figure>}
      </div> : <div className={styles.grid}>
        {intro.images.map((image, index) => { const diagram = image.kind === "diagram" || image.kind === "decorative"; const side = index === 0 ? styles.left : styles.right; const mask = index === 0 ? "data-intro-mask-y" : "data-intro-mask-x"; return <figure key={image.src} className={`${styles.image} ${side} ${diagram ? styles.diagram : ""}`} data-intro-image={index === 0 ? "left" : "right"} data-media-kind={image.kind} {...{ [mask]: true }}><Image src={image.src} alt={image.alt} fill sizes={index === 0 ? "(max-width: 768px) 100vw, 338px" : "(max-width: 768px) 100vw, 578px"} {...(!diagram ? { "data-intro-parallax": true } : {})} /></figure>; })}
        <div className={styles.bodyWrap} data-intro-reveal><p className={styles.body} data-intro-body>{intro.body}</p></div>
      </div>}
    </div>
  </section>;
}
