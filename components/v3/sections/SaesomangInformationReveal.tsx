"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { getV3Gsap } from "../motion/gsap";
import { useReducedMotion } from "../motion/useReducedMotion";

type Props = { section: "faq" | "stories" | "location"; children: ReactNode };
type ActiveTween = { kill: () => void; scrollTrigger?: { kill: () => void } };

export function SaesomangInformationReveal({ section, children }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const activeTweens = useRef(new Map<HTMLElement, ActiveTween>());
  const reduced = useReducedMotion();

  useGSAP(() => {
    const scope = root.current;
    const targets = scope ? Array.from(scope.querySelectorAll<HTMLElement>("[data-info-reveal]")) : [];
    if (!targets.length) return;
    const { gsap } = getV3Gsap();
    if (reduced !== false) {
      gsap.set(targets, { clearProps: "opacity,transform" });
      return;
    }
    const tweens = targets.map((target) => {
      const tween = gsap.fromTo(target, { opacity: 0, y: 16 }, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: "power2.out",
      scrollTrigger: { trigger: target, start: "top 90%", once: true },
      });
      activeTweens.current.set(target, tween);
      return tween;
    });
    return () => {
      tweens.forEach((tween) => { tween.scrollTrigger?.kill(); tween.kill(); });
      activeTweens.current.clear();
      targets.forEach((target) => gsap.set(target, { clearProps: "opacity,transform" }));
    };
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const revealFocused = (event: FocusEvent) => {
      const focused = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-info-reveal]") : null;
      if (!focused || !element.contains(focused)) return;
      const { gsap } = getV3Gsap();
      const tween = activeTweens.current.get(focused);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      activeTweens.current.delete(focused);
      gsap.killTweensOf(focused);
      focused.style.opacity = "1";
      focused.style.transform = "translateY(0)";
    };
    element.addEventListener("focusin", revealFocused);
    return () => element.removeEventListener("focusin", revealFocused);
  }, []);

  return <div ref={root} data-info-section={section} data-v3-info-reveal>{children}</div>;
}
