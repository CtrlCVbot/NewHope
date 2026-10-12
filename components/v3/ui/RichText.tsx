import type { RichText as RichTextValue } from "@/content/v3/types";
import { richTextSegments } from "./richTextSegments";
import styles from "./ui.module.css";

export function RichText({ value, className, tone = "gold" }: { value: RichTextValue; className?: string; tone?: "gold" | "cta" }) {
  const nodes = richTextSegments(value).map((segment, index) => segment.emphasized ? <em className={tone === "gold" ? styles.richGold : styles.richCta} key={index}>{segment.text}</em> : segment.text);
  return <span className={className} data-ui-richtext>{nodes}</span>;
}
