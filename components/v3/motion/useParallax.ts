"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { getV3Gsap } from "./gsap";

type ParallaxOptions = { amount?: number };

export function useParallax(root: RefObject<HTMLElement | null>, selector: string, reduced: boolean | null, { amount = -20 }: ParallaxOptions = {}) {
  useGSAP(() => {
    if (reduced === null || reduced) return;
    const images = root.current?.querySelectorAll<HTMLElement>(selector);
    if (!images?.length) return;
    const { gsap } = getV3Gsap();
    images.forEach((image) => {
      gsap.to(image, { yPercent: amount, ease: "none", scrollTrigger: { trigger: image.parentElement, start: "top 80%", end: "bottom top", scrub: true } });
    });
  }, { scope: root, dependencies: [selector, reduced, amount], revertOnUpdate: true });
}
