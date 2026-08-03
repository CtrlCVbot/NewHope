"use client";
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const groups = [
  ["서비스 알아보기", [["방문요양", "#services"], ["방문목욕", "#services"], ["어르신 케어", "#services"]]],
  ["이용 시작하기", [["이용 절차", "#process"], ["가족 FAQ", "#faq"]]],
  ["새소망 확인하기", [["센터 이야기", "#about"], ["블로그 소식", "#stories"], ["오시는 길", "#location"]]],
  ["바로 연결하기", [["상담하기", "#consult"], ["전화 031-726-5288", "tel:031-726-5288"]]],
] as const;
const services = [
  ["방문요양", "장기요양 1~5등급 어르신 댁에서 신체활동과 일상생활을 돕습니다.", "일상 가까이 필요한 도움을 맞춥니다.", "/service-homecare-v2.png", "가정에서 어르신의 일상을 돕는 방문요양"],
  ["방문목욕", "가정에서 필요한 방문목욕을 현재 생활 여건에 맞춰 안내합니다.", "편안함과 안전을 함께 살핍니다.", "/service-bathing-v2.png", "가정에서 안전하게 진행하는 방문목욕"],
  ["어르신 케어", "말벗과 생활 살핌으로 익숙한 하루의 리듬을 지켜갑니다.", "가족 같은 마음으로 곁에 있습니다.", "/service-companionship-v2.png", "어르신과 말벗이 되어 함께하는 케어"],
] as const;
const steps = ["장기요양 인정 신청", "방문조사", "의사소견서", "등급판정", "결과통보", "이용상담"];
const stories = [
  ["2025. 03. 08.", "방문요양센터의 전문인 배상책임보험과 화재보험 가입에 대해", "223788443272"],
  ["2025. 02. 13.", "장기요양요원의 고충 해소위한 시정 절차 등 보호수단 마련", "223759446035"],
  ["2024. 11. 22.", "장기요양기관 법정의무교육 관리 안내", "223669731043"],
  ["2024. 11. 14.", "장기요양기관에서의 정당한 해고 사유 및 절차", "223660131101"],
  ["2022. 10. 27.", "분당새소망방문요양센터 성남방문요양센터 성남재가복지센터 새소망방문요양센터 입니다.", "222912392169"],
  ["2022. 10. 27.", "오시는 길", "222912387833"],
  ["2019. 05. 23.", "노인장기요양보험 제도 및 신청방법 알아보기", "221545028279"],
] as const;

export default function V2Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [service, setService] = useState(0);
  const [sent, setSent] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  const heroRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ids = ["top", "about", "services", "process", "faq", "stories", "consult", "location"];
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--v2-progress", `${max ? (window.scrollY / max) * 100 : 0}%`);
      const current = [...ids].reverse().find((id) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= 130) ?? "top";
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) { const frame = requestAnimationFrame(() => { setShowDock(true); setProcessVisible(true); }); return () => cancelAnimationFrame(frame); }
    const heroObserver = new IntersectionObserver(([entry]) => setShowDock(!entry.isIntersecting), { threshold: 0.08 });
    const processObserver = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setProcessVisible(true); processObserver.disconnect(); } }, { threshold: 0.18 });
    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (processRef.current) processObserver.observe(processRef.current);
    return () => { heroObserver.disconnect(); processObserver.disconnect(); };
  }, []);
  useEffect(() => {
    document.body.classList.toggle(styles.locked, menuOpen);
    if (menuOpen) queueMicrotask(() => closeRef.current?.focus());
    if (!menuOpen && wasOpen.current) triggerRef.current?.focus();
    wasOpen.current = menuOpen;
    return () => document.body.classList.remove(styles.locked);
  }, [menuOpen]);
  const close = () => setMenuOpen(false);
  const trap = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") { close(); return; }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled])'));
    const first = items[0], last = items.at(-1);
    if (first && last && event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (first && last && !event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <main className={styles.root}>
    <div className={styles.progress} aria-hidden="true" />
    <div className={styles.utility}><span>분당·성남 어르신의 익숙한 일상을 위해, 가족 같은 마음으로 함께합니다.</span><a href="tel:031-726-5288">TEL 031-726-5288</a><a href="/compare">V1 / V2 비교</a></div>
    <header className={styles.header}><a className={styles.brand} href="#top">새소망 <small>방문요양센터</small></a><nav aria-label="현재 위치">{[["서비스", "services"], ["이용 절차", "process"], ["가족 안내", "faq"], ["센터 소식", "stories"]].map(([label, id]) => <a key={id} className={active === id ? styles.current : ""} aria-current={active === id ? "location" : undefined} href={`#${id}`}>{label}</a>)}</nav><button ref={triggerRef} className={styles.menuButton} type="button" aria-expanded={menuOpen} aria-controls="v2-menu" onClick={() => setMenuOpen(true)}>메뉴 <span aria-hidden="true">+</span></button></header>
    <section ref={heroRef} id="top" className={styles.hero}><img src="/hero-care.png" alt="햇살이 들어오는 집 안에서 손을 맞잡은 돌봄의 순간" /><div className={styles.heroShade} /><div className={styles.heroCopy}><p>NEW HOPE, AT HOME</p><h1>오늘의 삶이<br />익숙한 자리에서<br /><em>이어지도록.</em></h1><span>방문요양 · 방문목욕 · 어르신 케어</span><div><a href="#consult">상담 시작하기 <b>→</b></a><a href="#process">이용 순서 보기</a></div></div><p className={styles.direction}>BUNDANG<br />SEONGNAM<br />01</p></section>
    <section id="about" className={styles.intro}><p>01 — OUR WAY</p><h2>돌봄은 누군가의 하루를<br />원래의 자리로 돌려놓는 일입니다.</h2><div>새소망 방문요양센터는 장기요양 1~5등급 어르신을 대상으로 요양보호사 파견, 방문요양과 방문목욕을 안내합니다. 가족의 상황을 먼저 듣고 생활에 맞는 길을 함께 찾습니다.</div></section>
    <section id="services" className={styles.services}><div className={styles.sectionLead}><p>02 — SERVICES</p><h2>필요한 도움을<br />생활 가까이.</h2><span>세 가지 서비스 중 현재 가장 궁금한 내용을 골라 보세요.</span></div><div className={styles.servicePicker}>{services.map(([title], index) => <button key={title} type="button" className={service === index ? styles.selected : ""} onClick={() => setService(index)} aria-pressed={service === index}><small>0{index + 1}</small>{title}</button>)}</div><article className={styles.serviceStage} key={service}><div><p>CARE / 0{service + 1}</p><h3>{services[service][0]}</h3><strong>{services[service][2]}</strong><p>{services[service][1]}</p><a href="#consult">상담으로 이어가기 →</a></div><img src={services[service][3]} alt={services[service][4]} /></article></section>
    <section ref={processRef} id="process" className={`${styles.process} ${processVisible ? styles.processVisible : ""}`}><div><p>03 — STARTING CARE</p><h2>처음부터<br />함께 보는 길.</h2><p>제도 기준과 서류는 달라질 수 있으므로 신청 전 국민건강보험공단의 최신 기준을 확인해 주세요.</p></div><ol>{steps.map((step, index) => <li key={step}><span>0{index + 1}</span><h3>{step}</h3><p>{index === 5 ? "새소망과 생활에 맞는 방문요양·방문목욕 이용을 상담합니다." : "현재 필요한 도움과 다음 준비를 차분히 확인합니다."}</p></li>)}</ol></section>
    <section id="faq" className={styles.faq}><p>04 — FAMILY FAQ</p><h2>먼저 궁금한<br />이야기들입니다.</h2><details><summary>방문요양은 어떤 도움을 받을 수 있나요?</summary><p>신체활동, 일상생활, 정서지원 등의 범위를 상담 과정에서 확인합니다.</p></details><details><summary>방문목욕도 상담할 수 있나요?</summary><p>네. 가정에서 필요한 방문목욕과 방문요양을 현재 상황에 맞춰 안내합니다.</p></details><details><summary>이용 전에 무엇을 준비해야 하나요?</summary><p>개인 상황에 따라 다릅니다. 최신 장기요양 기준을 확인한 뒤 상담해 주세요.</p></details></section>
    <section id="stories" className={styles.stories}><div><p>05 — STORIES</p><h2>센터가 전하는<br />제도·운영 정보.</h2></div><div>{stories.map(([date, title, id]) => <a key={id} href={`https://blog.naver.com/wish5288/${id}`} target="_blank" rel="noreferrer"><span>{date}</span><strong>{title}</strong><b>↗</b></a>)}</div></section>
    <section id="consult" className={styles.consult}><div><p>06 — CONSULTATION</p><h2>부담 없이,<br />오늘의 이야기를<br />들려주세요.</h2><p>작성하신 내용은 이 화면에서만 확인되며 외부로 전송되거나 저장되지 않습니다.</p><a href="tel:031-726-5288">TEL 031-726-5288</a><a href="tel:010-5384-2146">Mobile 010-5384-2146</a><a href="https://open.kakao.com/o/ggmGtL5e" target="_blank" rel="noreferrer">카카오 오픈채팅 ↗</a><a href="https://blog.naver.com/wish5288" target="_blank" rel="noreferrer">네이버 블로그 ↗</a></div><form onSubmit={submit}>{sent ? <div className={styles.success} role="status"><strong>작성 내용을 이 화면에서 확인했습니다.</strong><p>이 양식은 외부 전송·저장 기능이 없는 안내용 화면입니다. 전화 또는 카카오 오픈채팅으로 실제 상담을 요청해 주세요.</p><button type="button" onClick={() => setSent(false)}>다시 작성하기</button></div> : <><label>이름<input required name="name" placeholder="성함을 입력해 주세요" /></label><label>연락처<input required name="phone" inputMode="tel" placeholder="연락 가능한 번호" /></label><label>남기고 싶은 이야기<textarea name="message" rows={4} placeholder="필요한 도움이나 궁금한 점" /></label><button type="submit">작성 내용 확인하기 →</button></>}</form></section>
    <section id="location" className={styles.location}><p>07 — VISIT US</p><h2>새소망 방문요양센터</h2><address>경기도 성남시 분당구 미금로 215 청솔마을 대원상가 207호<br /><small>청솔마을대원8단지아파트상가 2층</small></address><p>미금역 1번 출구에서 도보 5~10분입니다. 내비게이션에서는 <strong>청솔마을대원8단지아파트상가</strong>를 검색해 주세요.</p><details><summary>버스 안내 보기</summary><p><strong>2022년 블로그 안내 기준이며 현재 운행 여부 확인 필요</strong>합니다.</p><dl><dt>미금역.청솔마을.2001아울렛</dt><dd>일반 116-1, 116-3, 250, 300, 380, 390, 520, 720-1, 720-1A, 820</dd><dd>광역 102, 1101, 1303, 3500, 7007-1, 8100, 8106, 8109, G8110, M4102</dd><dd>마을 19, 32, 37, 810</dd><dt>미금역</dt><dd>일반 33-1, 51, 101, 720-2</dd><dd>마을 2, 7, 7-1, 14</dd></dl><a href="https://blog.naver.com/wish5288/222912387833" target="_blank" rel="noreferrer">블로그 원문에서 확인하기 ↗</a></details></section>
    <footer><strong>새소망 방문요양센터</strong><span>FAX 031-712-8718 · 분당·성남</span><a href="https://open.kakao.com/o/ggmGtL5e" target="_blank" rel="noreferrer">카카오 오픈채팅 ↗</a></footer>
    <a className={`${styles.mobileDock} ${showDock ? styles.dockVisible : ""}`} href="#consult">상담 시작하기 <span>031-726-5288</span></a>
    {menuOpen && <div className={styles.backdrop} onMouseDown={close}><section ref={dialogRef} id="v2-menu" className={styles.dialog} role="dialog" aria-modal="true" aria-label="새소망 목적별 메뉴" onKeyDown={trap} onMouseDown={(event) => event.stopPropagation()}><div><strong>새소망 방문요양센터</strong><button ref={closeRef} type="button" onClick={close} aria-label="메뉴 닫기">×</button></div><p>필요한 방향을 골라 주세요.</p><div className={styles.menuGroups}>{groups.map(([heading, links]) => <section key={heading}><h2>{heading}</h2>{links.map(([label, href]) => <a key={label} href={href} onClick={close}>{label}<b>↗</b></a>)}</section>)}</div><aside><strong>상담 전화 031-726-5288</strong><span>방문요양·방문목욕 이용을 차분히 안내합니다.</span></aside></section></div>}
  </main>;
}
