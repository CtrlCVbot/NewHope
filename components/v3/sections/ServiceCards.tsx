"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import type { V3Content } from "@/content/v3/types";
import { useBlurReveal } from "../motion/useBlurReveal";
import styles from "./services.module.css";

type Props = Pick<V3Content["services"], "cards" | "cardsLabel"> & { variant?: "design" | "saesomang" };
const iconNames: IconName[] = ["arrow-up-right", "leaf", "arrow-right", "check", "plus", "close"];
const subscribeToEnhancement = () => () => {};
const getClientEnhancement = () => true;
const getServerEnhancement = () => false;

function ServiceCard({ card, iconAsset }: { card: V3Content["services"]["cards"][number]; iconAsset?: string }) {
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
        <span className={styles.cardIcon}>{iconAsset ? <Image src={iconAsset} alt="" width={32} height={32} aria-hidden="true" /> : <Icon name={icon} />}</span>
        <span className={styles.cardTitle}>{card.title}</span>
        <span className={styles.cardSubtitle}>{card.subtitle}</span>
        <noscript><span className={styles.cardNoScript}>{card.description}</span></noscript>
      </span>
    </span>
  </button>;
}

function SaesomangServiceCard({ card, cardId, iconAsset }: { card: V3Content["services"]["cards"][number]; cardId: string; iconAsset?: string }) {
  const icon = iconNames.includes(card.icon as IconName) ? card.icon as IconName : "leaf";
  const enhanced = useSyncExternalStore(subscribeToEnhancement, getClientEnhancement, getServerEnhancement);
  const [hovered, setHovered] = useState(false);
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const [hoverSuppressed, setHoverSuppressed] = useState(false);
  const descriptionId = `${cardId}-description`;
  const open = enhanced && (manualOpen ?? (hovered && !hoverSuppressed));

  return <article className={`${styles.card} ${styles.saesomangCard}`} data-services-card data-enhanced={enhanced} data-open={open}>
    <div className={styles.saesomangCardBack} data-services-back>
      <span className={styles.cardImage} data-services-image><Image src={card.image.src} alt={card.image.alt} fill sizes="(max-width: 768px) calc(100vw - 48px), 380px" /></span>
      <div className={styles.saesomangCardContent}><span className={styles.cardIcon}>{iconAsset ? <Image src={iconAsset} alt="" width={32} height={32} aria-hidden="true" /> : <Icon name={icon} />}</span><h3 className={styles.cardTitle} aria-hidden={enhanced}>{card.title}</h3><p className={styles.cardSubtitle}>{card.subtitle}</p><p id={descriptionId} className={styles.cardDescription} data-services-description aria-hidden={enhanced && !open}>{card.description}</p></div>
    </div>
    <div className={styles.saesomangCardFront} data-services-front hidden={!enhanced}><div className={styles.cardContent}><span className={styles.cardIcon}>{iconAsset ? <Image src={iconAsset} alt="" width={32} height={32} aria-hidden="true" /> : <Icon name={icon} />}</span><h3 id={cardId} className={styles.cardTitle}>{card.title}</h3><p className={styles.cardSubtitle}>{card.subtitle}</p></div></div>
    <button type="button" className={styles.saesomangCardToggle} data-services-toggle hidden={!enhanced} aria-labelledby={cardId} aria-controls={descriptionId} aria-expanded={open}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") { setHovered(true); setHoverSuppressed(false); } }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") { setHovered(false); setManualOpen(null); setHoverSuppressed(false); } }}
      onClick={() => { setManualOpen(!open); setHoverSuppressed(false); }}
      onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); setManualOpen(false); setHoverSuppressed(true); } }} />
  </article>;
}

export function ServiceCards({ cards, cardsLabel, reduced, iconAssets, variant = "design" }: Props & { reduced: boolean | null; iconAssets?: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  useBlurReveal(root, "[data-services-card]", reduced, { duration: 0.9, stagger: 0.1, y: 60, blur: 0, perTarget: variant === "saesomang" });

  return <div ref={root} className={styles.cardsSection} aria-label={cardsLabel} data-services-cards data-reduced={reduced ? "true" : undefined}>
    <p className={styles.cardsLabel}>{cardsLabel}</p>
    <div className={styles.cards}>{cards.slice(0, 3).map((card, index) => variant === "saesomang" ? <SaesomangServiceCard key={`${card.title}-${card.subtitle}`} card={card} cardId={`saesomang-service-card-${index + 1}`} iconAsset={iconAssets?.[index]} /> : <ServiceCard key={`${card.title}-${card.subtitle}`} card={card} iconAsset={iconAssets?.[index]} />)}</div>
  </div>;
}
