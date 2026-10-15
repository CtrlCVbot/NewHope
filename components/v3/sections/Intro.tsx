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
        {intro.images.map((image, index) => {
          const diagram = image.kind === "diagram" || image.kind === "decorative";
          const side = index === 0 ? styles.left : styles.right;
          const mask = index === 0 ? "data-intro-mask-y" : "data-intro-mask-x";
          return <figure key={image.src} className={`${styles.image} ${side} ${diagram ? styles.diagram : ""}`} data-intro-image={index === 0 ? "left" : "right"} data-media-kind={image.kind} {...{ [mask]: true }}>
            <Image src={image.src} alt={image.alt} fill sizes={index === 0 ? "(max-width: 768px) 100vw, 338px" : "(max-width: 768px) 100vw, 578px"} {...(!diagram ? { "data-intro-parallax": true } : {})} />
          </figure>;
        })}
        <div className={styles.bodyWrap} data-intro-reveal><p className={styles.body} data-intro-body>{intro.body}</p></div>
      </div>
    </div>
  </section>;
}
