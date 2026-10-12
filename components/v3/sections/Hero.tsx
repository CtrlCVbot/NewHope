"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { getV3Gsap } from "../motion/gsap";
import { useReducedMotion } from "../motion/useReducedMotion";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import type { V3Content } from "@/content/v3/types";
import styles from "./hero.module.css";

type Props = { hero: V3Content["hero"]; ready: boolean };

export function Hero({ hero, ready }: Props) {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLAnchorElement>(null);
  const touchPointer = useRef(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const lines = hero.titleLines ?? [hero.title.text];
  const iconNames: IconName[] = ["arrow-up-right", "leaf", "arrow-right", "check", "plus", "close"];
  const cardIcon = iconNames.includes(hero.sideCard.icon as IconName) ? hero.sideCard.icon as IconName : "leaf";

  useGSAP((_, contextSafe) => {
    if (reduced === null) return;
    const scope = root.current;
    if (!scope || reduced) return;
    const { gsap } = getV3Gsap();
    const header = scope.closest("[data-v3-frame]")?.querySelector("[data-v3-header]");
    const background = scope.querySelector(`.${styles.background}`);
    const lines = scope.querySelectorAll("[data-hero-line]");
    const subtitle = scope.querySelector("[data-hero-subtitle]");
    const revealCard = scope.querySelector(`.${styles.cardReveal}`);
    gsap.set(background, { scale: 1.5 });
    if (header) gsap.set(header, { autoAlpha: 0, y: -50 });
    gsap.set(lines, { yPercent: 100 });
    gsap.set(subtitle, { autoAlpha: 0, y: 80, filter: "blur(20px)" });
    gsap.set(revealCard, { autoAlpha: 0, y: 40 });
    if (!ready) return;
    let cancelled = false;
    const run = (contextSafe ?? ((callback: () => void) => callback))(() => {
      if (cancelled) return;
      const timeline = gsap.timeline().to(background, { scale: 1, duration: 1.5, ease: "power2.out" });
      if (header) timeline.to(header, { autoAlpha: 1, y: 0, duration: .8, ease: "none" }, .2);
      timeline
        .to(lines, { yPercent: 0, duration: 1, stagger: .1, ease: "power2.out" }, .25)
        .to(subtitle, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .8, ease: "power2.out" }, .55)
        .to(revealCard, { autoAlpha: 1, y: 0, duration: .8, ease: "power2.out" }, .75);
    });
    document.fonts.ready.then(run);
    return () => { cancelled = true; };
  }, { scope: root, dependencies: [ready, reduced], revertOnUpdate: true });

  const move = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--tilt-x", `${(y - .5) * 20}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x - .5) * -20}deg`);
    event.currentTarget.style.setProperty("--shine-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--shine-y", `${y * 100}%`);
  };
  const reset = () => card.current?.style.setProperty("--tilt-x", "0deg") || card.current?.style.setProperty("--tilt-y", "0deg");
  return <div className={styles.wrap}>
    <section ref={root} className={styles.hero} data-v3-hero aria-label={hero.title.text}>
      <div className={styles.background} data-hero-bg><Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" /></div>
      <div className={styles.shade} />
      <div className={styles.content}>
        <div className={styles.copy}><h1 aria-label={hero.title.text}>{lines.map((line) => <span className={styles.lineMask} key={line} aria-hidden="true"><span data-hero-line>{line}</span></span>)}</h1>
          <p data-hero-subtitle>{hero.subtitle}</p></div>
        <div className={styles.cardReveal}><a ref={card} className={styles.card} data-hero-card href={hero.sideCard.href} aria-expanded={open} onPointerDown={(event) => { touchPointer.current = event.pointerType !== "mouse"; }} onPointerEnter={(event) => { if (event.pointerType === "mouse") setOpen(true); }} onPointerMove={move} onPointerLeave={() => { reset(); setOpen(false); }} onFocus={() => { if (!touchPointer.current) setOpen(true); }} onBlur={() => setOpen(false)} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); setOpen(false); } }} onClick={(event) => { if (touchPointer.current && !open) { event.preventDefault(); event.stopPropagation(); setOpen(true); touchPointer.current = false; } }}>
          <span className={styles.popover} data-hero-popover aria-hidden={!open}>{hero.sideCard.popover}</span>
          <Icon name={cardIcon} aria-hidden="true" /><span>{hero.sideCard.title.text}</span>
        </a></div>
        <a className={styles.scroll} data-hero-scroll href="#소개"><Icon name="arrow-right" aria-hidden="true" /><span>{hero.scrollLabel}</span></a>
      </div>
    </section><div className={styles.spacer} />
  </div>;
}
