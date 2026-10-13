"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import type { V3Content } from "@/content/v3/types";
import { useBlurReveal } from "../motion/useBlurReveal";
import styles from "./services.module.css";

type Props = Pick<V3Content["services"], "cards" | "cardsLabel">;
const iconNames: IconName[] = ["arrow-up-right", "leaf", "arrow-right", "check", "plus", "close"];

function ServiceCard({ card }: { card: V3Content["services"]["cards"][number] }) {
  const [open, setOpen] = useState(false);
  const touchPointer = useRef(false);
  const icon = iconNames.includes(card.icon as IconName) ? card.icon as IconName : "leaf";

  return <button type="button" className={styles.card} data-services-card aria-expanded={open}
    onPointerDown={(event) => { touchPointer.current = event.pointerType !== "mouse"; }}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") setOpen(true); }}
    onPointerLeave={(event) => { if (event.pointerType === "mouse") setOpen(false); }}
    onFocus={() => { if (!touchPointer.current) setOpen(true); }}
    onBlur={() => setOpen(false)}
    onKeyDown={(event) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpen((current) => !current); }
    }}
    onClick={() => { if (touchPointer.current) { setOpen((current) => !current); touchPointer.current = false; } }}>
    <span className={styles.cardImage} aria-hidden="true"><Image src={card.image.src} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" /></span>
    <span className={styles.cardDescription} data-services-description aria-hidden={!open}>{card.description}</span>
    <span className={styles.cardFront} data-services-front>
      <span className={styles.cardContent}>
        <span className={styles.cardIcon}><Icon name={icon} /></span>
        <span className={styles.cardTitle}>{card.title}</span>
        <span className={styles.cardSubtitle}>{card.subtitle}</span>
        <noscript><span className={styles.cardNoScript}>{card.description}</span></noscript>
      </span>
    </span>
  </button>;
}

export function ServiceCards({ cards, cardsLabel, reduced }: Props & { reduced: boolean | null }) {
  const root = useRef<HTMLDivElement>(null);
  useBlurReveal(root, "[data-services-card]", reduced, { duration: 0.9, stagger: 0.1, y: 60, blur: 0 });

  return <div ref={root} className={styles.cardsSection} aria-label={cardsLabel} data-services-cards data-reduced={reduced ? "true" : undefined}>
    <p className={styles.cardsLabel}>{cardsLabel}</p>
    <div className={styles.cards}>{cards.slice(0, 3).map((card) => <ServiceCard key={`${card.title}-${card.subtitle}`} card={card} />)}</div>
  </div>;
}
