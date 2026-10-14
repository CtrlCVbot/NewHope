"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

type Mode = "v1" | "split" | "v2" | "v3";
export default function ComparePage() {
  const [mode, setMode] = useState<Mode>("split"); const [mobile, setMobile] = useState(false);
  const frames = mode === "split" ? [["V1 · 현재 홈페이지", "/"], ["V2 · Calm Navigator", "/v2"]] : mode === "v1" ? [["V1 · 현재 홈페이지", "/"]] : mode === "v2" ? [["V2 · Calm Navigator", "/v2"]] : [["V3 · 2차 프로토타입", "/v3"]];
  return <main className={styles.root}><header><Link href="/">새소망 비교실</Link><p>로컬 디자인 비교 · 같은 내용, 다른 발견 방식</p><nav className={styles.quickLinks} aria-label="프로토타입 바로 보기"><Link href="/v2">V2 바로 보기 ↗</Link><Link href="/v3">V3 바로 보기 ↗</Link></nav></header><section className={styles.controls} aria-label="비교 설정"><div role="group" aria-label="보기 모드">{(["v1", "split", "v2", "v3"] as Mode[]).map((item) => <button key={item} type="button" aria-pressed={mode === item} className={mode === item ? styles.selected : ""} onClick={() => setMode(item)}>{item === "v1" ? "V1만" : item === "split" ? "나란히" : item === "v2" ? "V2만" : "V3만"}</button>)}</div><div role="group" aria-label="프레임 폭"><button type="button" aria-pressed={!mobile} className={!mobile ? styles.selected : ""} onClick={() => setMobile(false)}>Desktop</button><button type="button" aria-pressed={mobile} className={mobile ? styles.selected : ""} onClick={() => setMobile(true)}>Mobile</button></div></section><section className={`${styles.frames} ${mode === "split" ? styles.split : ""} ${mobile ? styles.mobile : ""}`}>{frames.map(([label, src]) => <article key={src}><h2>{label}</h2><div className={styles.device}><iframe title={label} src={src} /></div></article>)}</section></main>;
}
