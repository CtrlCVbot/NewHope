import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { render } from "./next-build-html.mjs";

const textOnly = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const attributeCount = (html, attribute) => (html.match(new RegExp(`\\b${attribute}(?:=|\\s|>)`, "g")) ?? []).length;
const stories = [
  ["224413549928", "2026. 09. 16.", "따뜻한 돌봄이 필요한 순간, 새소망 방문요양센터가 함께합니다"],
  ["222912392169", "2022. 10. 27.", "분당새소망방문요양센터 성남방문요양센터 성남재가복지센터 새소망방문요양센터 입니다."],
  ["222912387833", "2022. 10. 27.", "오시는 길"],
];
const photos = ["hero.webp", "intro-family-consultation.webp", "feature-living-conversation.webp", "service-daily-living.webp", "service-bath-preparation.webp", "service-companionship.webp"];

test("renders visible phase-two V3 facts, assets, anchors, and section order", async () => {
  const response = await render("/v3");
  const visible = textOnly(await response.text());
  assert.equal(response.status, 200);
  assert.match(visible, /<title>새소망 방문요양센터 · 2차 프로토타입<\/title>/);
  assert.match(visible, /<meta name="description" content="분당·성남 새소망 방문요양센터의 방문요양, 방문목욕, 이용 절차와 상담 안내를 담은 검토용 프로토타입입니다."/);
  assert.equal((visible.match(/<h1/g) ?? []).length, 1);
  for (const id of ["about", "services", "process", "stories", "location", "contact-cta", "consult"]) assert.equal((visible.match(new RegExp(`id="${id}"`, "g")) ?? []).length, 1);
  for (const fact of ["031-726-5288", "010-5384-2146", "031-712-8718", "경기도 성남시 분당구 미금로 215 청솔마을 대원상가 207호", "미금역 1번 출구에서 도보 5~10분입니다.", "익숙한 집에서,", "편안한 하루를.", "그룹방에는 연락처·건강정보·서류 사진을 올리지 마세요", "국민건강보험공단의 최신 기준"]) assert.match(visible, new RegExp(escapeRegExp(fact)));
  for (const [id, date, title] of stories) { const start = visible.indexOf(`data-story-id="${id}"`); const story = visible.slice(start, visible.indexOf("</a>", start)); assert.ok(start >= 0, `missing story ${id}`); assert.match(story, new RegExp(escapeRegExp(date))); assert.match(story, new RegExp(escapeRegExp(title))); }
  assert.equal(attributeCount(visible, "data-story-id"), 3);
  assert.equal((visible.match(/<details/g) ?? []).length, 4);
  assert.match(visible, /센터 이야기와 이용 안내\./);
  assert.match(visible, /블로그에서 더 보기/);
  assert.equal(attributeCount(visible, "data-process-step"), 6);
  assert.equal(attributeCount(visible, "data-services-card"), 3);
  assert.equal((visible.match(/<form\b/g) ?? []).length, 0);
  assert.equal((visible.match(/<input /g) ?? []).length, 0);
  assert.equal((visible.match(/<textarea/g) ?? []).length, 0);
  const kakaoLinks = [...visible.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].filter(([, href]) => href === "https://open.kakao.com/o/ggmGtL5e");
  assert.ok(kakaoLinks.length >= 4);
  for (const [tag] of kakaoLinks) assert.doesNotMatch(tag, /target="_blank"/);
  const photoTags = [...visible.matchAll(/<img\b[^>]*>/g)].filter(([tag]) => decodeURIComponent(tag.match(/\bsrc="([^"]+)"/)?.[1] ?? "").includes("/v3/saesomang/images/"));
  assert.equal(photoTags.length, 6);
  for (const [tag] of photoTags) assert.match(tag, /\balt="[^"]*"/);
  for (const photo of photos) assert.equal(photoTags.filter(([tag]) => decodeURIComponent(tag.match(/\bsrc="([^"]+)"/)?.[1] ?? "").includes(`/v3/saesomang/images/${photo}`)).length, 1, `expected one ${photo}`);
  const diagramTags = [...visible.matchAll(/<img\b[^>]*>/g)].filter(([tag]) => decodeURIComponent(tag.match(/\bsrc="([^"]+)"/)?.[1] ?? "").includes("/v3/saesomang/illustrations/"));
  assert.equal(diagramTags.length, 0, "the current Saesomang page must not request retained illustration sources");
  for (const asset of ["header-full.svg", "why.svg", "footer.svg", "home.svg", "bath.svg", "chat.svg"]) assert.match(visible, new RegExp(asset));
  assert.doesNotMatch(visible, /디자인 검토용|\/v3\/placeholders\//);
  const order = ["data-v3-hero", "id=\"about\"", "data-v3-feature", "id=\"services\"", "id=\"process\"", "data-v3-faq", "id=\"promises\"", "id=\"care\"", "id=\"stories\"", "data-v3-why", "id=\"contact-cta\"", "id=\"consult\"", "id=\"location\"", "data-v3-saesomang-footer"];
  let previous = -1; for (const marker of order) { const current = visible.indexOf(marker); assert.ok(current > previous, `${marker} must follow the preceding section`); previous = current; }
});

test("keeps the menu asset wired for browser-open state", async () => {
  const source = await readFile(new URL("../components/v3/layout/V3Frame.tsx", import.meta.url), "utf8");
  assert.match(source, /saesomangBrandAssets\.menuSvg/);
  assert.match(source, /saesomangBrandAssets\.footerSvg/);
  assert.match(source, /saesomangBrandAssets\.loaderSvg/);
});
