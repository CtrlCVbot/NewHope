"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./ui.module.css";

type Shared = { children: ReactNode; variant?: "default" | "small" | "gold"; glow?: boolean; disabled?: boolean; className?: string };
type ButtonProps = Shared & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = Shared & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };
export type CtaButtonProps = ButtonProps | LinkProps;

export function CtaButton({ children, variant = "default", glow = false, disabled = false, className, ...props }: CtaButtonProps) {
  const classes = [styles.cta, styles[`cta${variant[0].toUpperCase()}${variant.slice(1)}`], className].filter(Boolean).join(" ");
  const content = <><span className={styles.ctaText}>{children}</span><span className={styles.arrowContainer}><span className={styles.circle} /><span className={styles.iconWrap}><Icon name="arrow-up-right" className={styles.arrowFirst} data-cta-arrow="first" /><Icon name="arrow-up-right" className={styles.arrowSecond} data-cta-arrow="second" /></span></span></>;
  let control: ReactNode;
  if ("href" in props) {
    const linkProps = props as Omit<LinkProps, keyof Shared>;
    control = <a {...linkProps} href={disabled ? undefined : linkProps.href} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : linkProps.tabIndex} onClick={(event) => { if (disabled) event.preventDefault(); else linkProps.onClick?.(event); }} className={classes} data-v3-cta>{content}</a>;
  } else {
    const buttonProps = props as Omit<ButtonProps, keyof Shared>;
    control = <button {...buttonProps} type={buttonProps.type ?? "button"} disabled={disabled} className={classes} data-v3-cta>{content}</button>;
  }
  return glow ? <span className={[styles.glow, disabled ? styles.glowDisabled : ""].filter(Boolean).join(" ")} data-cta-glow>{control}</span> : control;
}
