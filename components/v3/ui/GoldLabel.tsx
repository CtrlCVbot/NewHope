import type { HTMLAttributes } from "react";
import styles from "./ui.module.css";

export function GoldLabel({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={[styles.goldLabel, className].filter(Boolean).join(" ")} {...props} />;
}
