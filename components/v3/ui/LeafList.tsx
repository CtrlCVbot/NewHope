import type { HTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./ui.module.css";

export function LeafList({ items, className, ...props }: { items: ReactNode[] } & HTMLAttributes<HTMLUListElement>) {
  return <ul className={[styles.leafList, className].filter(Boolean).join(" ")} {...props}>{items.map((item, index) => <li key={index}><Icon name="leaf" /><span>{item}</span></li>)}</ul>;
}
