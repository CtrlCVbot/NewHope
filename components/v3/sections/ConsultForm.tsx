"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import styles from "./extras.module.css";

type Field = { label: string; name: string; type: "text" | "tel" | "textarea" };
type Consult = { title: string; fields: Field[]; notice: string };
type Contact = { label: string; href: string };
type Props = { id?: string; consult: Consult; formConfirmation: string; contacts: Contact[] };
const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const isExternal = (href: string) => href.startsWith("http://") || href.startsWith("https://");

export function ConsultForm({ id = "consult", consult, formConfirmation, contacts }: Props) {
  const interactive = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [confirmed, setConfirmed] = useState(false);
  const instanceId = useId().replace(/:/g, "");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const noticeId = `${id}-${instanceId}-notice`;
  const confirmationId = `${id}-${instanceId}-confirmation`;
  const confirm = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); event.currentTarget.reset(); setConfirmed(true); requestAnimationFrame(() => statusRef.current?.focus()); };
  const reset = () => { setConfirmed(false); requestAnimationFrame(() => { const first = formRef.current?.elements.namedItem(consult.fields[0]?.name ?? ""); if (first instanceof HTMLElement) first.focus(); }); };

  return <section id={id} className={styles.consult} data-v3-consult><div className={styles.consultInner}>
    <header><p className={styles.kicker}>상담 안내</p><h2>{consult.title}</h2><p>{consult.notice}</p></header>
    <div><form ref={formRef} className={styles.form} onSubmit={confirm} aria-describedby={`${noticeId} ${confirmationId}`}><fieldset disabled={!interactive}>
      <legend className={styles.srOnly}>{consult.title}</legend><div className={styles.fields}>{consult.fields.map((field) => <label key={field.name} className={field.type === "textarea" ? styles.fullField : undefined}><span>{field.label}{field.name !== "message" && <em aria-hidden="true"> *</em>}</span>{field.type === "textarea" ? <textarea name={field.name} rows={5} /> : <input name={field.name} type={field.type} required />}</label>)}</div><button type="submit">작성 내용 확인하기</button>
    </fieldset></form><p id={noticeId} className={styles.privacyNotice}>{consult.notice}</p><p id={confirmationId} className={styles.confirmation}>{formConfirmation}</p>
    {confirmed && <div className={styles.success} role="status" aria-live="polite" tabIndex={-1} ref={statusRef}><p>작성 내용을 이 화면에서만 확인했습니다. 실제 상담은 아래 연락처로 요청해 주세요.</p><button type="button" onClick={reset}>다시 작성하기</button></div>}
    <nav className={styles.contactLinks} aria-label="상담 연락처">{contacts.map((contact) => <a key={contact.href} href={contact.href} {...(isExternal(contact.href) ? { target: "_blank", rel: "noreferrer" } : {})}>{contact.label}</a>)}</nav>
    <noscript><p className={styles.noScript}>개인정보 보호를 위해 JavaScript를 사용할 수 없을 때는 이 양식을 작성할 수 없습니다. 아래 연락처로 상담을 요청해 주세요.</p></noscript>
    </div>
  </div></section>;
}
