import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { render } from "./next-build-html.mjs";

const textOnly = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const attributeCount = (html, attribute) => (html.match(new RegExp(`\\b${attribute}(?:=|\\s|>)`, "g")) ?? []).length;
const stories = [
  ["223788443272", "2025. 03. 08.", "방문요양센터의 전문인 배상책임보험과 화재보험 가입에 대해"],
  ["223759446035", "2025. 02. 13.", "장기요양요원의 고충 해소위한 시정 절차 등 보호수단 마련"],
  ["223669731043", "2024. 11. 22.", "장기요양기관 법정의무교육 관리 안내"],
  ["223660131101", "2024. 11. 14.", "장기요양기관에서의 정당한 해고 사유 및 절차"],
  ["222912392169", "2022. 10. 27.", "분당새소망방문요양센터 성남방문요양센터 성남재가복지센터 새소망방문요양센터 입니다."],
  ["222912387833", "2022. 10. 27.", "오시는 길"],
  ["221545028279", "2019. 05. 23.", "노인장기요양보험 제도 및 신청방법 알아보기"],
];
const photos = ["hero.webp", "intro-left.webp", "intro-right.webp", "feature.webp", "services.webp", "card-1.webp", "card-2.webp", "card-3.webp", "mission.webp", "care-1.webp", "care-2.webp", "care-3.webp", "care-4.webp", "why.webp"];

test("renders visible phase-two V3 facts, assets, anchors, and section order", async () => {
  const response = await render("/v3");
  const visible = textOnly(await response.text());
  assert.equal(response.status, 200);
  assert.match(visible, /<title>새소망 방문요양센터 · 2차 프로토타입<\/title>/);
  assert.match(visible, /<meta name="description" content="분당·성남 새소망 방문요양센터의 방문요양, 방문목욕, 이용 절차와 상담 안내를 담은 검토용 프로토타입입니다."/);
  assert.equal((visible.match(/<h1/g) ?? []).length, 1);
  for (const id of ["about", "services", "process", "stories", "location", "consult"]) assert.equal((visible.match(new RegExp(`id="${id}"`, "g")) ?? []).length, 1);
  for (const fact of ["031-726-5288", "010-5384-2146", "031-712-8718", "경기도 성남시 분당구 미금로 215 청솔마을 대원상가 207호", "미금역 1번 출구에서 도보 5~10분입니다.", "장기요양 1~5등급", "외부로 전송되거나 저장되지 않습니다", "국민건강보험공단의 최신 기준"]) assert.match(visible, new RegExp(escapeRegExp(fact)));
  for (const [id, date, title] of stories) { const start = visible.indexOf(`data-story-id="${id}"`); const story = visible.slice(start, visible.indexOf("</a>", start)); assert.ok(start >= 0, `missing story ${id}`); assert.match(story, new RegExp(escapeRegExp(date))); assert.match(story, new RegExp(escapeRegExp(title))); }
  assert.equal(attributeCount(visible, "data-story-id"), 7);
  assert.equal((visible.match(/<details/g) ?? []).length, 3);
  assert.equal(attributeCount(visible, "data-process-step"), 6);
  assert.equal(attributeCount(visible, "data-services-card"), 3);
  assert.equal((visible.match(/<input /g) ?? []).length, 2);
  assert.equal((visible.match(/<textarea/g) ?? []).length, 1);
  const photoTags = [...visible.matchAll(/<img\b[^>]*>/g)].filter(([tag]) => decodeURIComponent(tag.match(/\bsrc="([^"]+)"/)?.[1] ?? "").includes("/v3/saesomang/images/"));
  assert.equal(photoTags.length, 14);
  for (const [tag] of photoTags) assert.match(tag, /\balt="[^"]*"/);
  for (const photo of photos) assert.equal(photoTags.filter(([tag]) => decodeURIComponent(tag.match(/\bsrc="([^"]+)"/)?.[1] ?? "").includes(`/v3/saesomang/images/${photo}`)).length, 1, `expected one ${photo}`);
  for (const asset of ["header-full.svg", "why.svg", "footer.svg", "home.svg", "bath.svg", "chat.svg"]) assert.match(visible, new RegExp(asset));
  assert.doesNotMatch(visible, /디자인 검토용|\/v3\/placeholders\//);
  const order = ["data-v3-hero", "id=\"about\"", "data-v3-feature", "id=\"services\"", "id=\"process\"", "data-v3-faq", "id=\"promises\"", "id=\"care\"", "id=\"stories\"", "data-v3-why", "id=\"contact-cta\"", "id=\"consult\"", "id=\"location\"", "data-v3-saesomang-footer"];
  let previous = -1; for (const marker of order) { const current = visible.indexOf(marker); assert.ok(current > previous, `${marker} must follow the preceding section`); previous = current; }
});

test("keeps the menu asset wired for browser-open state", async () => {
  const source = await readFile(new URL("../components/v3/layout/V3Frame.tsx", import.meta.url), "utf8");
  assert.match(source, /\/v3\/saesomang\/brand\/menu\.svg/);
});
