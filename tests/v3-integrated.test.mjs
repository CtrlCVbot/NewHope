import assert from "node:assert/strict";
import test from "node:test";
import { render } from "./next-build-html.mjs";

const countMarker = (html, marker) => (html.match(new RegExp(`\\b${marker}(?==|\\s|>)`, "g")) ?? []).length;
const withoutScripts = (html) => html.replace(/<script\b[\s\S]*?<\/script>/g, "");

test("server-renders the frozen V3 first-phase structure", async () => {
  const response = await render("/v3-design");
  const html = withoutScripts(await response.text());

  assert.equal(response.status, 200);

  const logicalBlocks = [
    "data-v3-hero",
    "data-v3-intro",
    "data-v3-feature",
    "data-services-statement",
    "data-services-lead",
    "data-services-cards",
    "data-v3-process",
    "data-v3-mission",
    "data-v3-care",
    "data-v3-why",
    "data-v3-cta-section",
  ];
  const positions = logicalBlocks.map((marker) => {
    assert.equal(countMarker(html, marker), 1, `${marker} is rendered once`);
    return html.indexOf(marker);
  });
  assert.deepEqual(positions, [...positions].sort((left, right) => left - right));

  const images = html.match(/<img\b[^>]*>/g) ?? [];
  const slotImages = images.filter((tag) => /slot-\d{2}\.svg/.test(tag));
  assert.equal(slotImages.length, 14);
  for (let slot = 1; slot <= 14; slot += 1) {
    const image = slotImages.filter((tag) => tag.includes(`slot-${String(slot).padStart(2, "0")}.svg`));
    assert.equal(image.length, 1, `slot ${slot} is rendered once`);
    assert.match(image[0], /\balt="[^"]*"/);
  }
  assert.ok(images.some((tag) => tag.includes("wordmark.svg") && /\balt="새소망"/.test(tag)), "brand image is separate from the fourteen slots");

  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const id of ["소개", "서비스", "이용 안내", "이야기", "돌봄", "상담"]) assert.match(html, new RegExp(`<section id="${id}"`));
  assert.equal((html.match(/<section id=/g) ?? []).length, 6);
  assert.doesNotMatch(html, /이 영역은 다음 작업 단위에서 실제 섹션으로 교체됩니다\./);

  assert.equal(countMarker(html, "data-feature-pill"), 6);
  assert.equal(countMarker(html, "data-services-card"), 3);
  assert.equal(countMarker(html, "data-process-step"), 6);
  assert.equal(countMarker(html, "data-mission-item"), 7);
  assert.equal(countMarker(html, "data-care-tab"), 4);
  assert.equal((html.match(/<div\b(?=[^>]*data-care-panel)(?=[^>]*role="tabpanel")[^>]*>/g) ?? []).length, 4);
});
