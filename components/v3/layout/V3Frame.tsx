"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { V3Content } from "@/content/v3/types";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MenuOverlay } from "./MenuOverlay";
import { ScrollTop } from "./ScrollTop";
import { SmoothScrollProvider, useSmoothScroll } from "./SmoothScroll";
import styles from "./frame.module.css";

function FrameInner({ content }: { content: V3Content }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pendingHref = useRef<string | null>(null);
  const wasOpen = useRef(false);
  const { lenis, reducedMotion, setScrollLocked } = useSmoothScroll();

  // Keep the document in normal flow so Lenis never observes a collapsed scroll limit.
  useLayoutEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const body = document.body;
    const position = window.scrollY;
    const previous = { rootOverflow: root.style.overflow, bodyOverflow: body.style.overflow, padding: body.style.paddingRight };
    const gutter = window.innerWidth - root.clientWidth;
    if (gutter) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + gutter}px`;
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous.rootOverflow;
      body.style.overflow = previous.bodyOverflow;
      body.style.paddingRight = previous.padding;
      window.scrollTo({ top: position, behavior: "instant" });
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    setScrollLocked(true);
    return () => setScrollLocked(false);
  }, [menuOpen, setScrollLocked]);

  useEffect(() => {
    if (menuOpen) return;
    const href = pendingHref.current;
    if (!href) return;
    const frame = requestAnimationFrame(() => {
      pendingHref.current = null;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      lenis?.resize();
      // Numeric positions avoid applying the CSS scroll margin twice in Lenis.
      const top = window.scrollY + target.getBoundingClientRect().top - 92;
      if (lenis) lenis.scrollTo(Math.max(0, top), { immediate: reducedMotion });
      else target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [menuOpen, lenis, reducedMotion]);

  const finishClose = useCallback(() => { setMenuOpen(false); setClosing(false); }, []);
  useEffect(() => {
    if (!menuOpen && wasOpen.current) triggerRef.current?.focus({ preventScroll: true });
    wasOpen.current = menuOpen;
  }, [menuOpen]);
  const close = () => setClosing(true);
  const navigate = (href: string) => { pendingHref.current = href; close(); };

  return <div className={styles.frame} data-v3-frame>
    <div inert={menuOpen || undefined}>
      <Header brand={content.brand} menuLabel={content.header.menuLabel} cta={content.header.cta} open={menuOpen} onOpen={() => setMenuOpen(true)} triggerRef={triggerRef} />
      <main className={styles.main}>
        {content.nav.map((item, index) => <section id={decodeURIComponent(item.href.slice(1))} key={item.href} className={styles.frameSection}>
          <p>0{index + 1} / {content.frame.sectionLabel}</p>
          {index === 0 ? <h1>{content.hero.title.text}</h1> : <h2>{item.label}</h2>}
          <span>{index === 0 ? content.hero.subtitle : content.frame.sectionNotice}</span>
        </section>)}
      </main>
      <Footer footer={content.footer} brand={content.brand} />
      <ScrollTop />
    </div>
    {menuOpen && <MenuOverlay closing={closing} reducedMotion={reducedMotion} nav={content.nav} brand={content.brand} description={content.frame.menuDescription} onClose={close} onClosed={finishClose} onNavigate={navigate} />}
  </div>;
}

export function V3Frame({ content }: { content: V3Content }) {
  return <SmoothScrollProvider><FrameInner content={content} /></SmoothScrollProvider>;
}
