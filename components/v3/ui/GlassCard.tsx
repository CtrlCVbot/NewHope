import type { HTMLAttributes } from "react";
import styles from "./ui.module.css";

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={[styles.glassCard, className].filter(Boolean).join(" ")} {...props} />;
}
