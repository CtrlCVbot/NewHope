"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { getV3Gsap } from "./gsap";

type RevealOptions = { duration?: number; stagger?: number; y?: number };

export function useReveal(root: RefObject<HTMLElement | null>, selector: string, reduced: boolean | null, { duration = 1, stagger = 0.1, y = 32 }: RevealOptions = {}) {
  useGSAP(() => {
    if (reduced === null || reduced) return;
    const targets = root.current?.querySelectorAll<HTMLElement>(selector);
    if (!targets?.length) return;
    const { gsap } = getV3Gsap();
    const original = Array.from(targets, (target) => ({ target, opacity: target.style.opacity, visibility: target.style.visibility, transform: target.style.transform }));
    const tween = gsap.fromTo(targets, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration, stagger, ease: "power2.out", scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
    return () => {
      tween.kill();
      original.forEach(({ target, opacity, visibility, transform }) => { target.style.opacity = opacity; target.style.visibility = visibility; target.style.transform = transform; });
    };
  }, { scope: root, dependencies: [selector, reduced, duration, stagger, y], revertOnUpdate: true });
}
