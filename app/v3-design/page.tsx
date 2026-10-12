import { v3PlaceholderContent } from "@/content/v3/placeholder";
import styles from "./page.module.css";

const candidates = [
  { id: "noto-serif-kr", name: "Noto Serif KR", family: "Noto Serif KR WU0", state: "ready" },
  { id: "maruburi", name: "MaruBuri", family: "MaruBuri WU0", state: "ready" },
  { id: "nanum-myeongjo", name: "Nanum Myeongjo · 나눔명조", family: "NanumMyeongjo WU0", state: "ready" },
] as const;

export default function V3DesignPage() {
  const { hero, intro, services } = v3PlaceholderContent;
  return <main className={styles.page}>
    <header className={styles.header}><p className={styles.eyebrow}>새소망 디자인 검토</p><h1>새소망 서체 비교</h1><p>아직 서체를 선택하지 않았습니다. 아래 세 후보의 실제 로컬 글꼴을 같은 조건에서 비교한 뒤 선택합니다.</p></header>
    <section className={styles.palette} aria-label="V3 색상 토큰 샘플"><span style={{ background: "var(--c-primary)" }}>기본 보라<br />#6c5275</span><span style={{ background: "var(--c-primary-light)", color: "var(--c-text)" }}>연한 보라<br />#b0a1bf</span><span style={{ background: "var(--c-teal)", color: "var(--c-text)" }}>청록<br />#74c1cd</span><span style={{ background: "var(--c-accent)", color: "var(--c-text)" }}>강조색<br />#c4a58a</span><span style={{ background: "var(--c-cream)", color: "var(--c-text)" }}>크림<br />#fbf8f5</span></section>
    <section className={styles.comparison} aria-labelledby="comparison-title"><div className={styles.sectionHeading}><p className={styles.eyebrow}>같은 조건</p><h2 id="comparison-title">같은 굵기 400 · 같은 문구 · 같은 색상</h2></div><div className={styles.grid}>{candidates.map((candidate) => <article key={candidate.id} id={`font-candidate-${candidate.id}`} className={styles.candidate} data-font-candidate={candidate.id} data-font-family={candidate.family} data-font-status={candidate.state}><p className={styles.candidateName}>{candidate.name}</p><p className={styles.heroSample} data-font-sample="hero" style={{ fontFamily: candidate.family }}>{hero.title.text}</p><p className={styles.sectionSample} data-font-sample="section" style={{ fontFamily: candidate.family }}>{intro.headline.text}</p><p className={styles.bodySample} data-font-sample="body" style={{ fontFamily: candidate.family }}>{services.statement.text}</p><p className={styles.fontMeta}>로컬 파일 · 굵기 400</p></article>)}</div></section>
    <section className={styles.notice} aria-label="다음 결정 안내"><p className={styles.eyebrow}>선택 필요</p><h2>선택 후에만 기본 세리프를 정합니다.</h2><p>선택 전에는 다음 화면 구현을 진행하지 않습니다.</p></section>
  </main>;
}
