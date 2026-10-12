"use client";

import { useState } from "react";
import { CtaButton } from "@/components/v3/ui/CtaButton";
import { GlassCard } from "@/components/v3/ui/GlassCard";
import { GoldLabel } from "@/components/v3/ui/GoldLabel";
import { Icon } from "@/components/v3/ui/Icon";
import { LeafList } from "@/components/v3/ui/LeafList";
import { RichText } from "@/components/v3/ui/RichText";
import styles from "./ui-page.module.css";

export function UiDemo() {
  const [count, setCount] = useState(0);
  return <main className={styles.page}>
    <header className={styles.header}><GoldLabel>V3 공용 UI</GoldLabel><h1>재사용 컴포넌트 검토</h1><p>버튼 상태와 공용 요소를 한 화면에서 확인합니다.</p></header>
    <section className={styles.section} aria-labelledby="cta-title"><h2 id="cta-title">상담 버튼</h2><div className={styles.actions}>
      <CtaButton data-ui-demo="default" href="#ui-target">상담 시작하기</CtaButton>
      <CtaButton data-ui-demo="small" variant="small" onClick={() => setCount((value) => value + 1)}>작은 버튼</CtaButton>
      <CtaButton data-ui-demo="gold" variant="gold" onClick={() => setCount((value) => value + 1)}>골드 버튼</CtaButton>
      <CtaButton data-ui-demo="glow" glow onClick={() => setCount((value) => value + 1)}>강조 상담</CtaButton>
      <CtaButton data-ui-demo="button" onClick={() => setCount((value) => value + 1)}>동작 확인</CtaButton>
      <CtaButton data-ui-demo="disabled-button" glow disabled onClick={() => setCount((value) => value + 1)}>비활성 버튼</CtaButton>
      <CtaButton data-ui-demo="disabled-link" href="#ui-target" disabled>비활성 링크</CtaButton>
      <CtaButton data-ui-demo="long-label" href="#ui-target">돌봄이 필요한 순간에 편안하게 상담을 시작해 보세요</CtaButton>
    </div><p className={styles.counter} data-ui-counter>{count}</p></section>
    <section className={styles.showcase}>
      <div><GoldLabel data-ui-gold-label>존엄한 돌봄</GoldLabel><RichText value={{ text: "안전한 <표현>도 텍스트로 읽고, 같은 강조 문구는 반복해도 안전합니다. 강조 문구", emphasis: ["강조 문구", "<표현>"] }} /><LeafList data-ui-leaf-list items={["일상에 맞춘 세심한 돌봄", "가족과 나누는 투명한 안내", "편안한 상담 준비"]} /></div>
      <GlassCard data-ui-glass-card><p className={styles.cardText}><RichText value={{ text: "한 사람의 생활 리듬을 존중하는 안내를 준비합니다.", emphasis: ["생활 리듬"] }} /></p><p>CSS로 재생성한 질감과 글래스 효과를 사용합니다.</p></GlassCard>
    </section>
    <section className={styles.icons} aria-label="아이콘 예시">{["arrow-up-right", "leaf", "arrow-right", "check", "plus", "close"].map((name) => <Icon key={name} name={name as "arrow-up-right" | "leaf" | "arrow-right" | "check" | "plus" | "close"} label={`${name} 아이콘`} />)}</section>
    <div id="ui-target" data-ui-target tabIndex={-1} className={styles.target}>정상 링크 목적지</div>
  </main>;
}
