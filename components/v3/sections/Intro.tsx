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

type Props = { intro: V3Content["intro"]; id: string };

function Headline({ value }: { value: V3Content["intro"]["headline"] }) {
  return <h2 className={styles.headline} data-intro-headline aria-label={value.text}>{richTextSegments(value).flatMap((segment, segmentIndex) => segment.text.split(/(\s+)/).map((part, partIndex) => {
    if (/^\s+$/.test(part)) return part;
    return <span className={styles.wordMask} key={`${segmentIndex}-${partIndex}`} aria-hidden="true"><span className={segment.emphasized ? styles.emphasis : undefined} data-intro-emphasis={segment.emphasized || undefined} data-intro-word>{part}</span></span>;
  }))}</h2>;
}

export function Intro({ intro, id }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useReveal(root, "[data-intro-reveal]", reduced, { duration: 1, stagger: 0.1, y: 32 });
  useWordReveal(root, "[data-intro-word]", reduced, { duration: 1, stagger: 0.06 });
  useMaskReveal(root, "[data-intro-mask-y]", reduced, { axis: "y" });
  useMaskReveal(root, "[data-intro-mask-x]", reduced, { axis: "x" });
  useParallax(root, "[data-intro-parallax]", reduced, { amount: -20 });
  return <section id={id} ref={root} className={styles.intro} data-v3-intro>
    <div className={styles.blurTop} aria-hidden="true" /><div className={styles.blurBottom} aria-hidden="true" /><div className={styles.spotlightLeft} aria-hidden="true" /><div className={styles.spotlightBody} aria-hidden="true" />
    <div className={styles.container}>
      <header className={styles.header}><p className={styles.label} data-intro-label data-intro-reveal>{intro.label}</p><Headline value={intro.headline} /></header>
      <div className={styles.grid}>
        <figure className={`${styles.image} ${styles.left}`} data-intro-image="left" data-intro-mask-y><Image src={intro.images[0].src} alt={intro.images[0].alt} fill sizes="(max-width: 768px) 100vw, 338px" data-intro-parallax /></figure>
        <figure className={`${styles.image} ${styles.right}`} data-intro-image="right" data-intro-mask-x><Image src={intro.images[1].src} alt={intro.images[1].alt} fill sizes="(max-width: 768px) 100vw, 578px" data-intro-parallax /></figure>
        <div className={styles.bodyWrap} data-intro-reveal><p className={styles.body} data-intro-body>{intro.body}</p></div>
      </div>
    </div>
  </section>;
}
