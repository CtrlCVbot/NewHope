import { useId } from "react";
import type { ReactNode, SVGProps } from "react";

export type IconName = "arrow-up-right" | "leaf" | "arrow-right" | "check" | "plus" | "close";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; label?: string };

export function Icon({ name, label, ...props }: IconProps) {
  const leafGradientId = `v3-leaf-gold-${useId().replace(/:/g, "")}`;
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, ReactNode> = {
    "arrow-up-right": <><path {...common} d="M5 19 19 5" /><path {...common} d="M8 5h11v11" /></>,
    "arrow-right": <><path {...common} d="M4 12h16" /><path {...common} d="m14 6 6 6-6 6" /></>,
    leaf: <><defs><linearGradient id={leafGradientId} x1="0" x2="1"><stop offset=".0055" stopColor="#e8cb92" /><stop offset=".2477" stopColor="#a48859" /><stop offset=".6229" stopColor="#e8cb92" /><stop offset=".9744" stopColor="#d0b67c" /></linearGradient></defs><path {...common} strokeWidth={1.5} stroke={`url(#${leafGradientId})`} d="M20 4C11 4 5 8.5 5 15c0 2.4 1.6 5 4 5 6.5 0 11-7 11-16ZM4 20c3.5-4.5 7.3-7 12-9" /></>,
    check: <path {...common} d="m5 12 4.5 4.5L19 7" />,
    plus: <><path {...common} d="M12 4v16" /><path {...common} d="M4 12h16" /></>,
    close: <><path {...common} d="m5 5 14 14M19 5 5 19" /></>,
  };
  return <svg viewBox="0 0 24 24" role={label ? "img" : undefined} aria-hidden={label ? undefined : true} aria-label={label} {...props}>{paths[name]}</svg>;
}
