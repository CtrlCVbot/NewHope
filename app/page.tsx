"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const menuItems = [
  ["센터 소개", "#about"],
  ["방문요양", "#care"],
  ["이용 절차", "#process"],
  ["자주 묻는 질문", "#faq"],
  ["상담 신청", "#consult"],
] as const;

const promises = [
  ["신체활동", "씻기, 식사, 이동처럼 매일 필요한 순간을 안전하게 보조합니다.", "01"],
  ["일상생활", "취사와 정리, 외출 동행 등 집 안팎의 생활 리듬을 함께 살핍니다.", "02"],
  ["정서지원", "말벗과 생활 상담으로 혼자라는 마음이 길어지지 않도록 곁을 지킵니다.", "03"],
] as const;

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
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("keydown", escape);
    };
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
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("js-reveal");
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const trapMenuFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <div className="ticker" aria-label="안내">
        <div className="ticker-track"><span>처음 상담부터 서비스 시작까지, 필요한 내용을 차분히 안내합니다.</span><span aria-hidden="true">처음 상담부터 서비스 시작까지, 필요한 내용을 차분히 안내합니다.</span></div>
      </div>
      <header className={`nav ${compact ? "nav-compact" : ""}`}>
        <a className="wordmark" href="#top" aria-label="새소망 방문요양 첫 화면">새소망 <small>방문요양</small></a>
        <nav aria-label="주요 메뉴">
          {menuItems.slice(0, 4).map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <button ref={triggerRef} className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="service-menu" onClick={() => setMenuOpen(true)}>메뉴 <span aria-hidden="true">+</span></button>
      </header>

      {menuOpen && <div className="menu-layer" onMouseDown={closeMenu}>
        <section ref={panelRef} id="service-menu" className="menu-panel" role="dialog" aria-modal="true" aria-label="새소망 메뉴" onKeyDown={trapMenuFocus} onMouseDown={(event) => event.stopPropagation()}>
          <div className="menu-top"><p>새소망 방문요양</p><button ref={closeRef} type="button" onClick={closeMenu} aria-label="메뉴 닫기">×</button></div>
          <p className="eyebrow">함께 살피는 일상</p>
          <div className="menu-links">{menuItems.map(([label, href], index) => <a key={href} href={href} onClick={closeMenu}><span>0{index + 1}</span>{label}<b aria-hidden="true">↗</b></a>)}</div>
          <div className="menu-note"><strong>운영 정보 등록 예정</strong><br />문의 채널과 상세 운영 정보는 확인 후 안내합니다.</div>
        </section>
      </div>}

      <section id="top" className="hero">
        {/* vinext worker runtime does not provide a compatible image optimizer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-care.png" alt="햇살이 들어오는 집 안에서 손을 맞잡은 돌봄의 순간" />
        <div className="hero-shade" />
        <div className="hero-copy"><p className="eyebrow">NEW HOPE, AT HOME</p><h1>익숙한 집에서,<br />오늘의 삶을 이어갑니다.</h1><p>가족의 일상과 어르신의 마음을 함께 살피며, 필요한 돌봄을 차분하게 연결합니다.</p><a className="button signal" href="#consult">상담 이야기 나누기 <span aria-hidden="true">→</span></a></div>
        <p className="hero-side">HOME CARE / 01</p>
      </section>

      <section id="about" className="intro wrap reveal"><p className="eyebrow">01 — OUR WAY</p><div><h2>돌봄은 누군가의 하루를<br />원래의 자리로 돌려놓는 일입니다.</h2><p>새소망 방문요양은 집에서 계속 살아가고 싶은 마음을 중심에 둡니다. 서두르지 않고 상황을 듣고, 필요한 도움부터 함께 정리합니다.</p></div></section>

      <section id="care" className="promise-section reveal"><div className="wrap"><div className="section-heading"><p className="eyebrow">02 — CARE PROMISE</p><h2>하루의 중요한 세 장면을<br />함께 돌봅니다.</h2></div><div className="promise-grid">{promises.map(([title, text, number]) => <article className="promise-card" key={title} tabIndex={0}><span>{number}</span><h3>{title}</h3><p>{text}</p><i aria-hidden="true">↗</i></article>)}</div></div></section>

      <div className="service-marquee" aria-label="제공 서비스"><div className="marquee-track"><div className="marquee-group"><span>방문요양</span><span>일상생활 지원</span><span>정서지원</span><span>외출 동행</span></div><div className="marquee-group" aria-hidden="true"><span>방문요양</span><span>일상생활 지원</span><span>정서지원</span><span>외출 동행</span></div></div></div>

      <section id="process" className="process wrap reveal"><div className="section-heading"><p className="eyebrow">03 — HOW IT WORKS</p><h2>처음부터 함께<br />순서를 만듭니다.</h2></div><ol>{[["이야기 나누기", "현재 필요한 도움과 일상을 편하게 들려주세요."],["이용 가능 여부 확인", "장기요양 인정과 필요한 준비를 함께 확인합니다."],["돌봄 계획 세우기", "생활 리듬에 맞는 도움의 범위를 차분히 정합니다."],["서비스 시작", "일상에 맞춰 돌봄을 시작하고 꾸준히 살핍니다."]].map(([title, text], i) => <li key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>

      <section id="faq" className="faq wrap reveal"><div className="section-heading"><p className="eyebrow">04 — FAQ</p><h2>먼저 궁금한<br />이야기들입니다.</h2></div><div className="faq-list"><details><summary>방문요양은 어떤 도움을 받을 수 있나요?</summary><p>신체활동, 일상생활, 정서지원 등 필요한 내용을 상황에 맞춰 안내합니다. 제공 범위는 상담 과정에서 확인합니다.</p></details><details><summary>이용 전에 무엇을 준비해야 하나요?</summary><p>현재 상황과 필요를 말씀해 주시면, 이용 가능 여부와 다음 순서를 쉽게 설명해 드립니다.</p></details><details><summary>비용이나 운영 시간도 알 수 있나요?</summary><p>정확한 운영 정보와 비용은 등록·확인 후 안내합니다. 이 페이지에서는 임의의 수가나 연락처를 안내하지 않습니다.</p></details></div></section>

      <section id="consult" className="consult reveal"><div className="wrap consult-grid"><div><p className="eyebrow">05 — CONSULTATION</p><h2>부담 없이,<br />오늘의 이야기를 들려주세요.</h2><p>작성하신 내용은 이 화면에서만 확인되며 외부로 전송되거나 저장되지 않습니다.</p></div><form onSubmit={submit}>{submitted ? <div className="success" role="status" tabIndex={-1}><strong>상담 이야기를 남길 준비가 되었습니다.</strong><p>현재는 전송하지 않는 안내용 화면입니다. 운영 정보 등록 후 실제 상담 채널을 연결할 예정입니다.</p><button type="button" onClick={() => setSubmitted(false)}>다시 작성하기</button></div> : <><label>이름<input name="name" required autoComplete="name" placeholder="성함을 입력해 주세요" /></label><label>연락처<input name="phone" required inputMode="tel" autoComplete="tel" placeholder="연락 가능한 번호를 입력해 주세요" /></label><label>남기고 싶은 이야기<textarea name="message" rows={4} placeholder="필요한 도움이나 궁금한 점을 적어 주세요" /></label><button className="button signal" type="submit">상담 요청 화면 확인하기 <span aria-hidden="true">→</span></button></>}</form></div></section>

      <footer><a className="wordmark" href="#top">새소망 <small>방문요양</small></a><p>익숙한 집에서의 오늘을 함께 이어갑니다.</p><p>운영 정보 등록 예정</p></footer>
    </main>
  );
}
