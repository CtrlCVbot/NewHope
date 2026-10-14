"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Link } from "@/content/v3/types";
import { CtaButton } from "../ui/CtaButton";
import styles from "./frame.module.css";

type Props = { brand: { name: string; tagline: string; wordmarkSvg?: string; markSvg?: string }; menuLabel: string; cta: Link; open: boolean; onOpen: () => void; triggerRef: React.RefObject<HTMLButtonElement | null>; homeHref?: string; useBrandAssets?: boolean };

export function Header({ brand, menuLabel, cta, open, onOpen, triggerRef, homeHref = "#소개", useBrandAssets = false }: Props) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 50); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  return <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`} data-v3-header data-scrolled={scrolled}>
    <a className={`${styles.brand} ${useBrandAssets ? styles.saesomangBrand : ""}`} href={homeHref} aria-label={`${brand.name} ${brand.tagline} 처음으로`}>{useBrandAssets && brand.wordmarkSvg && brand.markSvg ? <><Image className={styles.brandFull} src={brand.wordmarkSvg} alt="" width={216} height={54} /><Image className={styles.brandShort} src={brand.markSvg} alt="" width={120} height={40} /></> : <><span>{brand.name}</span><small>{brand.tagline}</small></>}</a>
    <div className={styles.headerActions}><button ref={triggerRef} type="button" className={styles.menuToggle} data-v3-menu-toggle aria-expanded={open} aria-controls="v3-menu" onClick={onOpen}>{menuLabel}<i aria-hidden="true" /></button><CtaButton className={styles.headerCta} variant="small" href={cta.href}>{cta.label}</CtaButton></div>
  </header>;
}
