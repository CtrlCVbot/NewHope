"use client";

import { useEffect, useState } from "react";
import type { Link } from "@/content/v3/types";
import styles from "./frame.module.css";

type Props = { brand: { name: string; tagline: string }; menuLabel: string; cta: Link; open: boolean; onOpen: () => void; triggerRef: React.RefObject<HTMLButtonElement | null> };

export function Header({ brand, menuLabel, cta, open, onOpen, triggerRef }: Props) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 50); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  return <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`} data-v3-header data-scrolled={scrolled}>
    <a className={styles.brand} href="#소개" aria-label={`${brand.name} ${brand.tagline} 처음으로`}><span>{brand.name}</span><small>{brand.tagline}</small></a>
    <div className={styles.headerActions}><button ref={triggerRef} type="button" className={styles.menuToggle} data-v3-menu-toggle aria-expanded={open} aria-controls="v3-menu" onClick={onOpen}>{menuLabel}<i aria-hidden="true" /></button><a className={styles.headerCta} href={cta.href}>{cta.label}<b aria-hidden="true">↗</b></a></div>
  </header>;
}
