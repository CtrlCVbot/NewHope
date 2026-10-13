"use client";

import { useRef } from "react";
import type { V3Content } from "@/content/v3/types";
import { RichText } from "../ui/RichText";
import { useBlurReveal } from "../motion/useBlurReveal";
import styles from "./services.module.css";

type Props = Pick<V3Content["services"], "statement" | "statementBody"> & { reduced: boolean | null };

function wordsWithSpaces(text: string) {
  return text.split(/(\s+)/).map((word, index) => word.trim() ? <span className={styles.statementWord} data-services-blur key={`${word}-${index}`}>{word}</span> : word);
}

export function ServicesStatement({ statement, statementBody, reduced }: Props) {
  const root = useRef<HTMLDivElement>(null);
  useBlurReveal(root, "[data-services-blur]", reduced, { duration: 0.9, stagger: 0.035, y: 30, blur: 12 });

  return <div ref={root} className={styles.statement} data-services-statement>
    <div className={styles.statementInner}>
      <h2><RichText value={statement} tone="gold" /></h2>
      <p>{wordsWithSpaces(statementBody)}</p>
    </div>
  </div>;
}
