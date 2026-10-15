"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { getV3Gsap } from "./gsap";

type BlurRevealOptions = { duration?: number; stagger?: number; y?: number; blur?: number; triggerSelector?: string; perTarget?: boolean };

/** Reveals only elements inside `root`, preserving pre-existing inline styles on cleanup. */
export function useBlurReveal(
  root: RefObject<HTMLElement | null>,
  selector: string,
  reduced: boolean | null,
  { duration = 0.9, stagger = 0.1, y = 30, blur = 12, triggerSelector, perTarget = false }: BlurRevealOptions = {},
) {
  useGSAP((_, contextSafe) => {
    if (reduced === null || reduced) return;
    const scope = root.current;
    const targets = scope ? Array.from(scope.querySelectorAll<HTMLElement>(selector)) : [];
    const trigger = triggerSelector ? scope?.querySelector<HTMLElement>(triggerSelector) : scope;
    if (!scope || !trigger || !targets?.length) return;

    const original = targets.map((target) => ({
      target,
      opacity: target.style.opacity,
      visibility: target.style.visibility,
      transform: target.style.transform,
      filter: target.style.filter,
    }));
    const { gsap } = getV3Gsap();
    let cancelled = false;
    const tweens: { kill: () => void }[] = [];
    const reveal = (contextSafe ?? ((callback: () => void) => callback))(() => {
      if (cancelled) return;
      if (perTarget) {
        targets.forEach((target) => tweens.push(gsap.fromTo(target, { autoAlpha: 0, y, filter: `blur(${blur}px)` }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration, ease: "power2.out", scrollTrigger: { trigger: target, start: "top 80%", once: true } })));
      } else {
        tweens.push(gsap.fromTo(targets, { autoAlpha: 0, y, filter: `blur(${blur}px)` }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration, stagger, ease: "power2.out", scrollTrigger: { trigger, start: "top 80%", once: true } }));
      }
    });
    void document.fonts.ready.then(reveal);

    return () => {
      cancelled = true;
      tweens.forEach((tween) => tween.kill());
      original.forEach(({ target, opacity, visibility, transform, filter }) => {
        target.style.opacity = opacity;
        target.style.visibility = visibility;
        target.style.transform = transform;
        target.style.filter = filter;
      });
    };
  }, { scope: root, dependencies: [selector, reduced, duration, stagger, y, blur, triggerSelector, perTarget], revertOnUpdate: true });
}
