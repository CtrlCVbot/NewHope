import styles from "./extras.module.css";
type Contact = { label: string; href: string };
type LocationData = { address: string; directions: string; navigationQuery: string };
type Props = { id?: string; brandName: string; location: LocationData; contacts: Contact[] };
function Address({ value }: { value: string }) { return <>{value.split("\n").map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</>; }
export function Location({ id = "location", brandName, location, contacts }: Props) {
  return <section id={id} className={styles.location} data-v3-location><div className={styles.locationInner}>
    <header className={styles.sectionHeader}><p className={styles.kicker}>오시는 길</p><h2>{brandName} 방문요양센터</h2></header>
    <div className={styles.locationContent}><address><Address value={location.address} /></address><p>{location.directions}</p><p className={styles.navigationQuery}>내비게이션 검색어: <strong>{location.navigationQuery}</strong></p><nav className={styles.locationContacts} aria-label="센터 연락처">{contacts.map((contact) => <a key={contact.href} href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel={contact.href.startsWith("http") ? "noreferrer" : undefined}>{contact.label}</a>)}</nav></div>
  </div></section>;
}
