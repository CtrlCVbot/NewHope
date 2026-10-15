"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { V3Content } from "@/content/v3/types";
import type { SaesomangExtras } from "@/content/v3/saesomang";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MenuOverlay } from "./MenuOverlay";
import { ScrollTop } from "./ScrollTop";
import { SmoothScrollProvider, useSmoothScroll } from "./SmoothScroll";
import { PageLoader } from "./PageLoader";
import { Hero } from "../sections/Hero";
import { Feature } from "../sections/Feature";
import { Intro } from "../sections/Intro";
import { Mission } from "../sections/Mission";
import { Process } from "../sections/Process";
import { Services } from "../sections/Services";
import { CareTabs } from "../sections/CareTabs";
import { Why } from "../sections/Why";
import { CtaSection } from "../sections/CtaSection";
import { Faq } from "../sections/Faq";
import { Stories } from "../sections/Stories";
import { ConsultationGuide } from "../sections/ConsultationGuide";
import { Location } from "../sections/Location";
import { SaesomangFooter } from "./SaesomangFooter";
import styles from "./frame.module.css";

type Variant = "design" | "saesomang";
function FrameInner({ content, variant = "design", extras, whyWordmarkSvg }: { content: V3Content; variant?: Variant; extras?: SaesomangExtras; whyWordmarkSvg?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [loaderActive, setLoaderActive] = useState(false);
  const finishLoader = useCallback(() => { setLoaderActive(false); setLoaderComplete(true); }, []);
  const startLoader = useCallback(() => setLoaderActive(true), []);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pendingHref = useRef<string | null>(null);
  const wasOpen = useRef(false);
  const { lenis, reducedMotion, setScrollLocked } = useSmoothScroll();
  const interactionLocked = menuOpen || loaderActive;

  // Keep the document in normal flow so Lenis never observes a collapsed scroll limit.
  useLayoutEffect(() => {
    if (!interactionLocked) return;
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
  }, [interactionLocked]);

  useEffect(() => {
    if (!interactionLocked) return;
    setScrollLocked(true);
    return () => setScrollLocked(false);
  }, [interactionLocked, setScrollLocked]);

  useEffect(() => {
    if (menuOpen) return;
    const href = pendingHref.current;
    if (!href?.startsWith("#")) return;
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
  const navigate = (href: string) => { if (!href.startsWith("#")) return; pendingHref.current = href; close(); };

  return <div className={styles.frame} data-v3-frame>
    <div inert={menuOpen || loaderActive || undefined}>
      <Header brand={content.brand} menuLabel={content.header.menuLabel} cta={content.header.cta} open={menuOpen} onOpen={() => setMenuOpen(true)} triggerRef={triggerRef} homeHref={variant === "saesomang" ? "#about" : undefined} useBrandAssets={variant === "saesomang"} />
      <main className={styles.main}>
        <Hero hero={content.hero} ready={loaderComplete} scrollHref={variant === "saesomang" ? "#process" : undefined} />
        {variant === "saesomang" && extras ? <>
          <Intro id="about" intro={content.intro} /><Feature feature={content.feature} /><Services id="services" services={content.services} iconAssets={["/v3/saesomang/icons/home.svg", "/v3/saesomang/icons/bath.svg", "/v3/saesomang/icons/chat.svg"]} />
          <Process id="process" process={content.process} showNote />
          <Faq id="faq" faq={extras.faq} />
          <Mission id="promises" mission={content.mission} /><CareTabs id="care" care={content.care} />
          <Stories id="stories" stories={extras.stories} storyNotice={extras.storyNotice} />
          <Why why={content.why} brand={{ ...content.brand, wordmarkSvg: whyWordmarkSvg ?? content.brand.wordmarkSvg }} />
          <CtaSection id="contact-cta" cta={content.cta}><ConsultationGuide id="consult" guide={extras.consultation} /></CtaSection>
          <Location id="location" brandName={content.brand.name} location={extras.location} contacts={extras.contacts} />
        </> : content.nav.map((item, index) => {
          const id = decodeURIComponent(item.href.slice(1));
          if (index === 0) return <Fragment key={item.href}><Intro id={id} intro={content.intro} /><Feature feature={content.feature} /></Fragment>;
          if (index === 1) return <Services key={item.href} id={id} services={content.services} />;
          if (index === 2) return <Process key={item.href} id={id} process={content.process} />;
          if (index === 3) return <Mission key={item.href} id={id} mission={content.mission} />;
          if (index === 4) return <Fragment key={item.href}><CareTabs id={id} care={content.care} /><Why why={content.why} brand={content.brand} /></Fragment>;
          if (index === 5) return <CtaSection key={item.href} id={id} cta={content.cta} />;
          return <section id={id} key={item.href} className={styles.frameSection}>
            <p>0{index + 1} / {content.frame.sectionLabel}</p>
            <h2>{item.label}</h2>
            <span>{content.frame.sectionNotice}</span>
          </section>;
        })}
      </main>
      {variant === "saesomang" && extras ? <SaesomangFooter footer={{ ...content.footer, links: extras.contacts, legal: [] }} brand={content.brand} /> : <Footer footer={content.footer} brand={content.brand} />}
      <ScrollTop />
    </div>
    {menuOpen && <MenuOverlay closing={closing} reducedMotion={reducedMotion} nav={content.nav} brand={content.brand} description={content.frame.menuDescription} menuAsset={variant === "saesomang" ? "/v3/saesomang/brand/menu.svg" : undefined} onClose={close} onClosed={finishClose} onNavigate={navigate} />}
    <PageLoader brand={content.brand} onStart={startLoader} onComplete={finishLoader} storageKey={variant === "saesomang" ? "v3-pageLoaded" : undefined} />
  </div>;
}

export function V3Frame({ content, variant, extras, whyWordmarkSvg }: { content: V3Content; variant?: Variant; extras?: SaesomangExtras; whyWordmarkSvg?: string }) {
  return <SmoothScrollProvider><FrameInner content={content} variant={variant} extras={extras} whyWordmarkSvg={whyWordmarkSvg} /></SmoothScrollProvider>;
}
