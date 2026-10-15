"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import type { V3Content } from "@/content/v3/types";
import { getV3Gsap } from "../motion/gsap";
import { useMaskReveal } from "../motion/useMaskReveal";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useReveal } from "../motion/useReveal";
import { GoldLabel } from "../ui/GoldLabel";
import { LeafList } from "../ui/LeafList";
import { richTextSegments } from "../ui/richTextSegments";
import styles from "./mission.module.css";

type Props = { id: string; mission: V3Content["mission"] };

export function SaesomangMission({ id, mission }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useReveal(root, "[data-mission-reveal]", reduced, { duration: 0.72, stagger: 0.08, y: 18, perTarget: true });
  useMaskReveal(root, "[data-mission-mask]", reduced, { axis: "x", duration: 0.9 });

  useGSAP(() => {
    if (reduced !== false) return;
    const { gsap } = getV3Gsap();
    const media = gsap.matchMedia();
    media.add("(min-width: 961px)", () => {
      const photo = root.current?.querySelector<HTMLElement>("[data-mission-photo-motion]");
      if (!photo) return;
      return gsap.fromTo(photo, { y: 0 }, {
        y: -24,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  return <section id={id} ref={root} className={`${styles.mission} ${styles.saesomangMission}`} data-v3-mission>
    <div className={styles.saesomangWrapper}>
      <div className={styles.saesomangContent}>
        <GoldLabel className={styles.label} data-mission-reveal>{mission.label}</GoldLabel>
        <h2 className={styles.saesomangTitle} data-mission-reveal>{richTextSegments(mission.title).map((segment, index) => segment.emphasized ? <em key={index}>{segment.text}</em> : <span key={index}>{segment.text}</span>)}</h2>
        <LeafList className={styles.saesomangList} items={mission.items.map((item) => <span key={item} data-mission-item>{item}</span>)} data-mission-reveal />
      </div>
      <figure className={styles.saesomangPhoto} data-mission-image data-mission-photo-motion>
        <Image src={mission.image.src} alt={mission.image.alt} width={1200} height={800} sizes="(max-width: 960px) calc(100vw - 4rem), 560px" priority={false} />
        <div className={styles.saesomangMask} data-mission-mask aria-hidden="true" />
      </figure>
    </div>
  </section>;
}
