"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import type { V3Content } from "@/content/v3/types";
import { getV3Gsap } from "../motion/gsap";
import { useMaskReveal } from "../motion/useMaskReveal";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useReveal } from "../motion/useReveal";
import styles from "./saesomang-why.module.css";

type Props = { why: V3Content["why"]; brand: V3Content["brand"] };

export function SaesomangWhy({ why, brand }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useReveal(root, "[data-saesomang-why-reveal]", reduced, { duration: 0.82, stagger: 0.1, y: 20, perTarget: true });
  useMaskReveal(root, "[data-saesomang-why-mask]", reduced, { axis: "x", duration: 0.9 });

  useGSAP(() => {
    if (reduced !== false) return;
    const photo = root.current?.querySelector<HTMLElement>("[data-saesomang-why-photo-motion]");
    if (!photo) return;
    const { gsap } = getV3Gsap();
    const media = gsap.matchMedia();
    media.add("(min-width: 961px)", () => gsap.fromTo(photo, { y: 0 }, {
      y: -32,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
    }));
    return () => media.revert();
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  return <section ref={root} className={styles.why} data-v3-why data-media-kind={why.image.kind ?? "photo"}>
    <div className={styles.wrapper}>
      <div className={styles.brand} data-why-logo data-saesomang-why-reveal>
        <Image src={brand.wordmarkSvg} alt={brand.name} width={900} height={250} sizes="(max-width: 960px) min(700px, calc(100vw - 4rem)), 700px" priority={false} />
      </div>
      <figure className={styles.photo} data-saesomang-why-photo-motion data-why-photo-motion>
        <Image src={why.image.src} alt={why.image.alt} width={1536} height={1024} sizes="(max-width: 960px) calc(100vw - 4rem), 768px" priority={false} unoptimized data-why-image />
        <span className={styles.mask} data-saesomang-why-mask aria-hidden="true" />
      </figure>
      <div className={styles.copy}>
        <h2 data-why-title data-saesomang-why-reveal>{why.title.text}</h2>
        <p data-why-body data-saesomang-why-reveal>{why.body}</p>
        <p className={styles.footnote} data-why-footnote data-saesomang-why-reveal>{why.footnote}</p>
      </div>
    </div>
  </section>;
}
