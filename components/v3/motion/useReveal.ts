"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { getV3Gsap } from "./gsap";

type RevealOptions = { duration?: number; stagger?: number; y?: number; triggerSelector?: string; perTarget?: boolean };

export function useReveal(root: RefObject<HTMLElement | null>, selector: string, reduced: boolean | null, { duration = 1, stagger = 0.1, y = 32, triggerSelector, perTarget = false }: RevealOptions = {}) {
  useGSAP(() => {
    if (reduced === null || reduced) return;
    const scope = root.current;
    const targets = scope ? Array.from(scope.querySelectorAll<HTMLElement>(selector)) : [];
    const trigger = triggerSelector ? scope?.querySelector<HTMLElement>(triggerSelector) : scope;
    if (!scope || !trigger || !targets?.length) return;
    const { gsap } = getV3Gsap();
    const original = targets.map((target) => ({ target, opacity: target.style.opacity, visibility: target.style.visibility, transform: target.style.transform }));
    const tweens = perTarget
      ? targets.map((target) => gsap.fromTo(target, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration, ease: "power2.out", scrollTrigger: { trigger: target, start: "top 80%", once: true } }))
      : [gsap.fromTo(targets, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration, stagger, ease: "power2.out", scrollTrigger: { trigger, start: "top 80%", once: true } })];
    return () => {
      tweens.forEach((tween) => tween.kill());
      original.forEach(({ target, opacity, visibility, transform }) => { target.style.opacity = opacity; target.style.visibility = visibility; target.style.transform = transform; });
    };
  }, { scope: root, dependencies: [selector, reduced, duration, stagger, y, triggerSelector, perTarget], revertOnUpdate: true });
}
