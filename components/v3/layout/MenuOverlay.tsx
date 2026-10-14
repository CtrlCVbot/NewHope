"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Link } from "@/content/v3/types";
import styles from "./frame.module.css";

type Props = {
  closing: boolean; reducedMotion: boolean; nav: Link[];
  brand: { name: string; tagline: string }; description: string; menuAsset?: string;
  onClose: () => void; onClosed: () => void; onNavigate: (href: string) => void;
};

export function MenuOverlay({ closing, reducedMotion, nav, brand, description, menuAsset, onClose, onClosed, onNavigate }: Props) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    if (!closing) return;
    // Cancel on unmount or preference changes, including mid-exit.
    const timer = window.setTimeout(onClosed, reducedMotion ? 0 : 500);
    return () => window.clearTimeout(timer);
  }, [closing, reducedMotion, onClosed]);

  useEffect(() => {
    const trap = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'));
      const first = items[0], last = items.at(-1);
      const focused = document.activeElement;
      const inside = items.some((item) => item === focused);
      if (first && last && event.shiftKey && (focused === first || !inside)) { event.preventDefault(); last.focus(); }
      if (first && last && !event.shiftKey && (focused === last || !inside)) { event.preventDefault(); first.focus(); }
    };
    // A click on the empty panel can blur its controls; Escape must still close it.
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [onClose]);

  return <div className={`${styles.backdrop} ${closing ? styles.closing : ""}`} data-v3-backdrop onMouseDown={onClose}>
    <section id="v3-menu" ref={dialogRef} className={styles.menu} data-v3-menu data-lenis-prevent role="dialog" aria-modal="true" aria-label={`${brand.name} 전체 메뉴`} onMouseDown={(event) => event.stopPropagation()}>
      <button ref={closeRef} className={styles.close} type="button" aria-label="메뉴 닫기" onClick={onClose}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
      <div className={styles.menuInner}>
        <nav aria-label="주요 메뉴">
          {nav.map((item, index) => <a key={item.href} data-v3-menu-link style={{ "--delay": `${200 + index * 100}ms` } as React.CSSProperties} href={item.href} onClick={(event) => { event.preventDefault(); if (!closing) onNavigate(item.href); }}>
            <span className={styles.labelMask}><span>{item.label}</span><span aria-hidden="true">{item.label}</span></span>
          </a>)}
        </nav>
        <div className={styles.menuBrand}>{menuAsset ? <Image src={menuAsset} alt="" width={320} height={96} /> : <><strong>{brand.name}</strong><small>{brand.tagline}</small></>}<p>{description}</p></div>
      </div>
    </section>
  </div>;
}
