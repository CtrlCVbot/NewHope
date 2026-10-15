"use client";

import { useRef } from "react";
import Image from "next/image";
import type { V3Content } from "@/content/v3/types";
import { useMaskReveal } from "../motion/useMaskReveal";
import { useParallax } from "../motion/useParallax";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useReveal } from "../motion/useReveal";
import { GoldLabel } from "../ui/GoldLabel";
import { LeafList } from "../ui/LeafList";
import { richTextSegments } from "../ui/richTextSegments";
import styles from "./mission.module.css";

type Props = { id: string; mission: V3Content["mission"] };

export function Mission({ id, mission }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useReveal(root, "[data-mission-reveal]", reduced, { duration: 0.8, stagger: 0.08, y: 24 });
  useMaskReveal(root, "[data-mission-mask]", reduced, { axis: "x" });
  const photoLayout = mission.image.kind === "photo";
  useParallax(root, "[data-mission-parallax]", reduced, { amount: -20 });

  return <section id={id} ref={root} className={`${styles.mission} ${photoLayout ? styles.photoMission : ""}`} data-v3-mission>
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <GoldLabel className={styles.label} data-mission-reveal>{mission.label}</GoldLabel>
          <h2 className={styles.title} data-mission-reveal>{richTextSegments(mission.title).map((segment, index) => segment.emphasized ? <em key={index}>{segment.text}</em> : <span key={index}>{segment.text}</span>)}</h2>
          <LeafList className={styles.list} items={mission.items.map((item) => <span key={item} data-mission-item>{item}</span>)} data-mission-reveal />
        </div>
      </div>
      <div className={styles.image} data-mission-image>
        <Image src={mission.image.src} alt={mission.image.alt} fill sizes="(max-width: 768px) 100vw, 50vw" {...(!photoLayout ? { "data-mission-parallax": true } : {})} />
        {!photoLayout && <div className={styles.gradient} aria-hidden="true" />}
        <div className={styles.mask} data-mission-mask aria-hidden="true" />
      </div>
    </div>
  </section>;
}
