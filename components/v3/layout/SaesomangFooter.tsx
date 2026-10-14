import type { V3Content } from "@/content/v3/types";
import styles from "../sections/extras.module.css";
/* eslint-disable @next/next/no-img-element -- The approved static footer brand is an SVG asset. */
type Props = Pick<V3Content, "brand" | "footer">;
const isExternal = (href: string) => href.startsWith("http://") || href.startsWith("https://");
export function SaesomangFooter({ brand, footer }: Props) {
  const links = [...footer.links, ...footer.legal];
  return <footer className={styles.saesomangFooter} data-v3-saesomang-footer><img src="/v3/saesomang/brand/footer.svg" alt={`${brand.name} ${brand.tagline}`} /><div><p>{footer.copyright}</p>{footer.fax && <p>{footer.fax}</p>}</div><nav aria-label="센터 연락처">{links.map((link) => <a key={`${link.href}-${link.label}`} href={link.href} {...(isExternal(link.href) ? { target: "_blank", rel: "noreferrer" } : {})}>{link.label}</a>)}</nav></footer>;
}
