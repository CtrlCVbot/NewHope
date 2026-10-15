"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { getV3Gsap } from "./gsap";

type WordRevealOptions = { duration?: number; stagger?: number; triggerSelector?: string };

export function useWordReveal(root: RefObject<HTMLElement | null>, selector: string, reduced: boolean | null, { duration = 1, stagger = 0.06, triggerSelector }: WordRevealOptions = {}) {
  useGSAP((_, contextSafe) => {
    if (reduced === null || reduced) return;
    const scope = root.current;
    const words = scope?.querySelectorAll<HTMLElement>(selector);
    const trigger = triggerSelector ? scope?.querySelector<HTMLElement>(triggerSelector) : scope;
    if (!scope || !trigger || !words?.length) return;
    const { gsap } = getV3Gsap();
    const original = Array.from(words, (word) => ({ word, transform: word.style.transform }));
    let cancelled = false;
    let tween: gsap.core.Tween | undefined;
    const reveal = (contextSafe ?? ((callback: () => void) => callback))(() => {
      if (cancelled) return;
      tween = gsap.fromTo(words, { yPercent: 100 }, { yPercent: 0, duration, stagger, ease: "power2.out", scrollTrigger: { trigger, start: "top 80%", once: true } });
    });
    void document.fonts.ready.then(reveal);
    return () => { cancelled = true; tween?.kill(); original.forEach(({ word, transform }) => { word.style.transform = transform; }); };
  }, { scope: root, dependencies: [selector, reduced, duration, stagger, triggerSelector], revertOnUpdate: true });
}
