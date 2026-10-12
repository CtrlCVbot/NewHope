import type { V3Content } from "@/content/v3/types";
import styles from "./frame.module.css";
export function Footer({ footer, brand }: Pick<V3Content, "footer" | "brand">) { const links = [...footer.links, ...footer.legal]; return <footer className={styles.footer} data-v3-footer><div><strong>{brand.name}</strong><span>{brand.tagline}</span></div><p>{footer.copyright}</p>{links.length > 0 && <nav aria-label="푸터 링크">{links.map((link) => <a key={`${link.href}-${link.label}`} href={link.href}>{link.label}</a>)}</nav>}</footer>; }
