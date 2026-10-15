"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { getV3Gsap } from "./gsap";

type RevealOptions = { duration?: number; stagger?: number; y?: number; triggerSelector?: string };

export function useReveal(root: RefObject<HTMLElement | null>, selector: string, reduced: boolean | null, { duration = 1, stagger = 0.1, y = 32, triggerSelector }: RevealOptions = {}) {
  useGSAP(() => {
    if (reduced === null || reduced) return;
    const scope = root.current;
    const targets = scope?.querySelectorAll<HTMLElement>(selector);
    const trigger = triggerSelector ? scope?.querySelector<HTMLElement>(triggerSelector) : scope;
    if (!scope || !trigger || !targets?.length) return;
    const { gsap } = getV3Gsap();
    const original = Array.from(targets, (target) => ({ target, opacity: target.style.opacity, visibility: target.style.visibility, transform: target.style.transform }));
    const tween = gsap.fromTo(targets, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration, stagger, ease: "power2.out", scrollTrigger: { trigger, start: "top 80%", once: true } });
    return () => {
      tween.kill();
      original.forEach(({ target, opacity, visibility, transform }) => { target.style.opacity = opacity; target.style.visibility = visibility; target.style.transform = transform; });
    };
  }, { scope: root, dependencies: [selector, reduced, duration, stagger, y, triggerSelector], revertOnUpdate: true });
}
