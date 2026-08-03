"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const menuItems = [
  ["센터 소개", "#about"], ["방문요양·목욕", "#care"], ["이용 절차", "#process"], ["블로그 소식", "#stories"], ["오시는 길", "#location"], ["상담", "#consult"],
] as const;
const services = [
  ["방문요양", "장기요양 1~5등급 어르신 댁으로 요양보호사가 찾아가 신체활동과 일상생활을 돕습니다.", "01"],
  ["방문목욕", "편안하고 안전한 일상을 위해 가정에서 필요한 방문목욕을 상담 후 안내합니다.", "02"],
  ["어르신 케어", "말벗과 생활 살핌까지, 가족과 같은 마음으로 생활 리듬을 함께 지켜갑니다.", "03"],
] as const;
const processSteps = [
  ["장기요양 인정 신청", "국민건강보험공단에 장기요양 인정 신청을 합니다."], ["방문조사", "공단 직원의 방문조사로 현재 필요한 도움을 확인합니다."], ["의사소견서", "안내받은 절차에 따라 의사소견서를 준비합니다."], ["등급판정", "등급판정위원회의 심의를 거쳐 결과가 결정됩니다."], ["결과통보", "장기요양인정서와 이용 계획 관련 결과를 받습니다."], ["이용상담", "새소망과 생활에 맞는 방문요양·방문목욕 이용을 상담합니다."],
] as const;
const posts = [
  ["2025. 03. 08.", "노인장기요양보험", "방문요양센터의 전문인 배상책임보험과 화재보험 가입에 대해", "223788443272"],
  ["2025. 02. 13.", "노인장기요양보험", "장기요양요원의 고충 해소위한 시정 절차 등 보호수단 마련", "223759446035"],
  ["2024. 11. 22.", "노인장기요양보험", "장기요양기관 법정의무교육 관리 안내", "223669731043"],
  ["2024. 11. 14.", "노인장기요양보험", "장기요양기관에서의 정당한 해고 사유 및 절차", "223660131101"],
  ["2022. 10. 27.", "센터소개", "분당새소망방문요양센터 성남방문요양센터 성남재가복지센터 새소망방문요양센터 입니다.", "222912392169"],
  ["2022. 10. 27.", "오시는 길", "오시는 길", "222912387833"],
  ["2019. 05. 23.", "노인장기요양보험", "노인장기요양보험 제도 및 신청방법 알아보기", "221545028279"],
] as const;
const blogHref = (postId: string) => `https://blog.naver.com/wish5288/${postId}`;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasMenuOpen = useRef(false);

  useEffect(() => {
    const update = () => setCompact(window.scrollY > 38);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("keydown", escape);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("keydown", escape); };
  }, []);
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (menuOpen) queueMicrotask(() => closeRef.current?.focus());
    if (!menuOpen && wasMenuOpen.current) triggerRef.current?.focus();
    wasMenuOpen.current = menuOpen;
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!elements.length || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js-reveal");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); document.documentElement.classList.remove("js-reveal"); };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const trapMenuFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    const first = focusable[0]; const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };

  return <main>
    <div className="ticker" aria-label="안내"><div className="ticker-track"><span>분당·성남 어르신의 익숙한 일상을 위해, 가족 같은 마음으로 함께합니다.</span><span aria-hidden="true">분당·성남 어르신의 익숙한 일상을 위해, 가족 같은 마음으로 함께합니다.</span></div></div>
    <header className={`nav ${compact ? "nav-compact" : ""}`}><a className="wordmark" href="#top" aria-label="새소망 방문요양센터 첫 화면">새소망 <small>방문요양센터</small></a><nav aria-label="주요 메뉴">{menuItems.slice(0, 4).map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav><button ref={triggerRef} className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="service-menu" onClick={() => setMenuOpen(true)}>메뉴 <span aria-hidden="true">+</span></button></header>
    {menuOpen && <div className="menu-layer" onMouseDown={closeMenu}><section ref={panelRef} id="service-menu" className="menu-panel" role="dialog" aria-modal="true" aria-label="새소망 메뉴" onKeyDown={trapMenuFocus} onMouseDown={(event) => event.stopPropagation()}><div className="menu-top"><p>새소망 방문요양센터</p><button ref={closeRef} type="button" onClick={closeMenu} aria-label="메뉴 닫기">×</button></div><p className="eyebrow">BUNDANG · SEONGNAM</p><div className="menu-links">{menuItems.map(([label, href], index) => <a key={href} href={href} onClick={closeMenu}><span>0{index + 1}</span>{label}<b aria-hidden="true">↗</b></a>)}</div><div className="menu-note"><strong>상담 전화 031-726-5288</strong><br />방문요양·방문목욕 이용을 차분히 안내합니다.</div></section></div>}
    <section id="top" className="hero">
      {/* Keep the supplied care photograph as a plain image to preserve its local composition. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero-care.png" alt="햇살이 들어오는 집 안에서 손을 맞잡은 돌봄의 순간" />
      <div className="hero-shade" /><div className="hero-copy"><p className="eyebrow">NEW HOPE, AT HOME</p><h1>익숙한 집에서,<br />오늘의 삶을 이어갑니다.</h1><p>분당·성남 새소망 방문요양센터는 가족과 같은 마음으로 어르신과 요양보호사에게 성심성의껏 최선을 다합니다.</p><a className="button signal" href="#consult">상담 이야기 나누기 <span aria-hidden="true">→</span></a></div><p className="hero-side">HOME CARE / 01</p>
    </section>
    <section id="about" className="intro wrap reveal"><p className="eyebrow">01 — OUR WAY</p><div><h2>돌봄은 누군가의 하루를<br />원래의 자리로 돌려놓는 일입니다.</h2><p>새소망 방문요양센터는 장기요양 1~5등급 어르신을 대상으로 요양보호사 파견, 방문요양, 방문목욕과 어르신 케어를 안내합니다. 성남·분당을 중심으로 수도권 방문 상담도 함께 살핍니다.</p></div></section>
    <section id="care" className="promise-section reveal"><div className="wrap"><div className="section-heading"><p className="eyebrow">02 — CARE PROMISE</p><h2>필요한 돌봄을<br />생활 가까이 연결합니다.</h2></div><div className="promise-grid">{services.map(([title, text, number]) => <article className="promise-card" key={title} tabIndex={0}><span>{number}</span><h3>{title}</h3><p>{text}</p><i aria-hidden="true">↗</i></article>)}</div></div></section>
    <div className="service-marquee" aria-label="제공 서비스"><div className="marquee-track"><div className="marquee-group"><span>방문요양</span><span>방문목욕</span><span>요양보호사 파견</span><span>어르신 케어</span></div><div className="marquee-group" aria-hidden="true"><span>방문요양</span><span>방문목욕</span><span>요양보호사 파견</span><span>어르신 케어</span></div></div></div>
    <section id="process" className="process wrap reveal"><div className="section-heading"><p className="eyebrow">03 — HOW IT WORKS</p><h2>장기요양 이용,<br />순서부터 함께 봅니다.</h2><p className="section-note">제도 기준과 서류는 달라질 수 있으므로 신청 전 국민건강보험공단의 최신 기준을 확인해 주세요.</p></div><ol>{processSteps.map(([title, text], i) => <li key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
    <section id="stories" className="stories wrap reveal"><div className="section-heading"><p className="eyebrow">04 — BLOG STORIES</p><h2>센터가 전하는<br />제도·운영 정보입니다.</h2><p className="section-note">보험·교육·근로 관련 글은 센터의 가입 또는 이수 증명이 아닌, 참고를 위한 제도·운영 정보입니다.</p></div><div className="story-list">{posts.map(([date, category, title, id]) => <a key={id} className="story" href={blogHref(id)} target="_blank" rel="noreferrer" aria-label={`${date} ${category}: ${title} 네이버 블로그에서 새 창으로 보기`}><span>{date}</span><em>{category}</em><strong>{title}</strong><b aria-hidden="true">↗</b></a>)}</div></section>
    <section id="faq" className="faq wrap reveal"><div className="section-heading"><p className="eyebrow">05 — FAQ</p><h2>먼저 궁금한<br />이야기들입니다.</h2></div><div className="faq-list"><details><summary>방문요양은 어떤 도움을 받을 수 있나요?</summary><p>장기요양 1~5등급 어르신을 위한 신체활동, 일상생활, 정서지원 등의 범위를 상담 과정에서 확인합니다.</p></details><details><summary>방문목욕도 상담할 수 있나요?</summary><p>네. 가정에서 필요한 방문목욕과 방문요양을 현재 상황에 맞춰 안내합니다.</p></details><details><summary>이용 전에 무엇을 준비해야 하나요?</summary><p>이용 절차와 필요한 준비는 개인 상황에 따라 다를 수 있습니다. 최신 장기요양 기준을 확인한 뒤 상담해 주세요.</p></details></div></section>
    <section id="consult" className="consult reveal"><div className="wrap consult-grid"><div><p className="eyebrow">06 — CONSULTATION</p><h2>부담 없이,<br />오늘의 이야기를 들려주세요.</h2><p>작성하신 내용은 이 화면에서만 확인되며 외부로 전송되거나 저장되지 않습니다.</p><div className="contact-links"><a href="tel:031-726-5288">TEL 031-726-5288</a><a href="tel:010-5384-2146">Mobile 010-5384-2146</a><a href="https://open.kakao.com/o/ggmGtL5e" target="_blank" rel="noreferrer">카카오 오픈채팅 ↗</a><a href="https://blog.naver.com/wish5288" target="_blank" rel="noreferrer">네이버 블로그 ↗</a></div></div><form onSubmit={submit}>{submitted ? <div className="success" role="status" tabIndex={-1}><strong>작성 내용을 이 화면에서 확인했습니다.</strong><p>이 양식은 외부 전송·저장 기능이 없는 안내용 화면입니다. 전화, 카카오 오픈채팅 또는 네이버 블로그로 실제 상담을 요청해 주세요.</p><button type="button" onClick={() => setSubmitted(false)}>다시 작성하기</button></div> : <><label>이름<input name="name" required autoComplete="name" placeholder="성함을 입력해 주세요" /></label><label>연락처<input name="phone" required inputMode="tel" autoComplete="tel" placeholder="연락 가능한 번호를 입력해 주세요" /></label><label>남기고 싶은 이야기<textarea name="message" rows={4} placeholder="필요한 도움이나 궁금한 점을 적어 주세요" /></label><button className="button signal" type="submit">작성 내용 확인하기 <span aria-hidden="true">→</span></button></>}</form></div></section>
    <section id="location" className="location wrap reveal"><p className="eyebrow">07 — VISIT US</p><div><h2>새소망 방문요양센터</h2><address>경기도 성남시 분당구 미금로 215 청솔마을 대원상가 207호<br /><small>청솔마을대원8단지아파트상가 2층</small></address><p>미금역 1번 출구에서 도보 5~10분입니다. 내비게이션에서는 <strong>청솔마을대원8단지아파트상가</strong>를 검색해 주세요.</p><details><summary>버스 안내 보기</summary><p>버스 정보는 <strong>2022년 블로그 안내 기준이며 현재 운행 여부 확인 필요</strong>합니다.</p><dl className="bus-list"><dt>미금역.청솔마을.2001아울렛</dt><dd>일반 116-1, 116-3, 250, 300, 380, 390, 520, 720-1, 720-1A, 820</dd><dd>광역 102, 1101, 1303, 3500, 7007-1, 8100, 8106, 8109, G8110, M4102</dd><dd>마을 19, 32, 37, 810</dd><dt>미금역</dt><dd>일반 33-1, 51, 101, 720-2</dd><dd>마을 2, 7, 7-1, 14</dd></dl><p><a href={blogHref("222912387833")} target="_blank" rel="noreferrer">블로그 원문에서 확인하기 ↗</a></p></details></div></section>
    <footer><a className="wordmark" href="#top">새소망 <small>방문요양센터</small></a><p>FAX 031-712-8718 · 분당·성남</p><div><a href="tel:031-726-5288">TEL 031-726-5288</a> · <a href="tel:010-5384-2146">Mobile 010-5384-2146</a> · <a href="https://open.kakao.com/o/ggmGtL5e" target="_blank" rel="noreferrer">카카오</a> · <a href="https://blog.naver.com/wish5288" target="_blank" rel="noreferrer">블로그</a></div></footer>
  </main>;
}
