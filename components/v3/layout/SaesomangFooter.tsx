import type { ContactLink, V3Content } from "@/content/v3/types";
import styles from "../sections/extras.module.css";
/* eslint-disable @next/next/no-img-element -- The approved static footer brand is an SVG asset. */
type Props = { brand: V3Content["brand"]; footer: Omit<V3Content["footer"], "links" | "legal"> & { links: ContactLink[]; legal: ContactLink[] }; asset: string };
export function SaesomangFooter({ brand, footer, asset = "/v3/saesomang/brand/footer.svg" }: Props) {
  const links = [...footer.links, ...footer.legal];
  return <footer className={styles.saesomangFooter} data-v3-saesomang-footer><img src={asset} alt={`${brand.name} ${brand.tagline}`} /><div><p>{footer.copyright}</p>{footer.fax && <p>{footer.fax}</p>}</div><nav aria-label="센터 정보와 참고 자료">{links.map((link) => link.kind === "center-info" ? <span key={`${link.href}-${link.label}`}>{link.label}</span> : <a key={`${link.href}-${link.label}`} href={link.href} {...(link.kind === "reference" ? { target: "_blank", rel: "noreferrer" } : {})}>{link.label}</a>)}</nav></footer>;
}
