import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { render } from "./next-build-html.mjs";

const postMetadata = [
  ["2025. 03. 08.", "노인장기요양보험", "방문요양센터의 전문인 배상책임보험과 화재보험 가입에 대해", "223788443272"],
  ["2025. 02. 13.", "노인장기요양보험", "장기요양요원의 고충 해소위한 시정 절차 등 보호수단 마련", "223759446035"],
  ["2024. 11. 22.", "노인장기요양보험", "장기요양기관 법정의무교육 관리 안내", "223669731043"],
  ["2024. 11. 14.", "노인장기요양보험", "장기요양기관에서의 정당한 해고 사유 및 절차", "223660131101"],
  ["2022. 10. 27.", "센터소개", "분당새소망방문요양센터 성남방문요양센터 성남재가복지센터 새소망방문요양센터 입니다.", "222912392169"],
  ["2022. 10. 27.", "오시는 길", "오시는 길", "222912387833"],
  ["2019. 05. 23.", "노인장기요양보험", "노인장기요양보험 제도 및 신청방법 알아보기", "221545028279"],
];

test("server-renders the 새소망 방문요양센터 homepage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>새소망 방문요양센터 \| 익숙한 집에서 이어가는 오늘<\/title>/);
  for (const text of ["새소망 방문요양센터", "장기요양 1~5등급", "방문목욕", "031-726-5288", "031-712-8718", "010-5384-2146", "미금로 215", "미금역 1번 출구", "2022년 블로그 안내 기준이며 현재 운행 여부 확인 필요", "116-1, 116-3, 250", "102, 1101, 1303", "33-1, 51, 101, 720-2", "최신 기준을 확인", "외부로 전송되거나 저장되지 않습니다", "hero-care.png"]) assert.match(html, new RegExp(text));
  for (const [date, category, title, id] of postMetadata) for (const value of [date, category, title, id]) assert.match(html, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(html, /운영 정보 등록 예정|codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("keeps interaction, content, and accessibility contracts in source", async () => {
  const [page, css, layout, packageJson] = await Promise.all([readFile(new URL("../app/page.tsx", import.meta.url), "utf8"), readFile(new URL("../app/globals.css", import.meta.url), "utf8"), readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"), readFile(new URL("../package.json", import.meta.url), "utf8")]);
  for (const text of ["event.key === \"Escape\"", "document.body.classList.toggle(\"menu-open\"", "event.preventDefault()", "aria-modal=\"true\"", "closeRef.current?.focus()", "trapMenuFocus", "IntersectionObserver", "marquee-group\" aria-hidden=\"true\"", "rel=\"noreferrer\"", "tel:031-726-5288", "tel:010-5384-2146", "eslint-disable-next-line @next/next/no-img-element", "#location", "#consult", "id=\"location\"", "blogHref(\"222912387833\")"]) assert.match(page, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const label of ["방문요양", "방문목욕", "요양보호사 파견", "어르신 케어"]) assert.equal((page.match(new RegExp(label, "g")) ?? []).length >= 2, true);
  assert.match(css, /grid-template-columns:120px/); assert.match(css, /\.story\{transition:none\}/); assert.match(css, /prefers-reduced-motion:reduce/); assert.match(css, /\.js-reveal \.reveal\.is-visible/); assert.match(css, /animation-play-state:paused/); assert.match(css, /min-height:44px/); assert.match(layout, /새소망 방문요양센터 — 익숙한 집에서/); assert.match(layout, /lang="ko"/); assert.match(layout, /export const metadata: Metadata/); assert.doesNotMatch(layout, /next\/headers|generateMetadata|headers\(/); await assert.rejects(access(new URL("../app/chatgpt-auth.ts", import.meta.url))); assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
