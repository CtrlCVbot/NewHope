"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { getV3Gsap } from "./gsap";

type MaskRevealOptions = { axis: "x" | "y"; duration?: number };

export function useMaskReveal(root: RefObject<HTMLElement | null>, selector: string, reduced: boolean | null, { axis, duration = 1.2 }: MaskRevealOptions) {
  useGSAP(() => {
    if (reduced === null || reduced) return;
    const masks = root.current?.querySelectorAll<HTMLElement>(selector);
    if (!masks?.length) return;
    const { gsap } = getV3Gsap();
    const property = axis === "x" ? "--mask-x" : "--mask-y";
    masks.forEach((mask) => {
      gsap.set(mask, { [property]: "0%" });
      gsap.to(mask, { [property]: "100%", duration, ease: "power2.inOut", scrollTrigger: { trigger: mask, start: "top 80%", once: true } });
    });
  }, { scope: root, dependencies: [selector, reduced, axis, duration], revertOnUpdate: true });
}
