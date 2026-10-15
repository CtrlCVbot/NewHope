import test from "node:test";
import assert from "node:assert/strict";
import { render } from "./next-build-html.mjs";

test("server-renders Mission and Care with their accessible content contracts", async () => {
  const response = await render("/v3-design");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /data-v3-mission/);
  assert.equal((html.match(/data-mission-item/g) ?? []).length, 7);
  assert.match(html, /data-v3-care/);
  assert.match(html, /data-care-current/);
  assert.equal((html.match(/\bdata-care-tab(?:[=\s>])/g) ?? []).length, 4);
  assert.equal((html.match(/data-care-panel/g) ?? []).length, 4);
  assert.equal((html.match(/data-care-image/g) ?? []).length, 4);
  assert.equal((html.match(/data-care-progress/g) ?? []).length, 4);
  for (const slot of [9, 10, 11, 12, 13]) assert.match(html, new RegExp(`slot-${String(slot).padStart(2, "0")}\\.svg`));
  assert.equal((html.match(/<section id=/g) ?? []).length, 6);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
});

test("renders Saesomang responsive Care tabs with readable HTML bodies and progress controls", async () => {
  const response = await render("/v3");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /data-care-rotation="responsive"/);
  assert.equal((html.match(/data-care-panel/g) ?? []).length, 4);
  assert.equal((html.match(/data-care-progress/g) ?? []).length, 4);
  assert.match(html, /궁금한 서비스 종류와 일반적인 이용 절차를 오픈채팅에서 확인합니다\./);
  assert.match(html, /이용 전에 확인할 사항을 정리합니다\. 절차에서 궁금한 부분과 준비사항을 함께 살펴봅니다\./);
  assert.match(html, /필요한 지역과 일정에 관한 안내를 받습니다\. 실제 이용 가능 여부는 상담에서 확인합니다\./);
  assert.match(html, /상담에서 하나씩 함께 확인합니다\./);
  assert.match(html, /care-first-question\.webp/);
  assert.match(html, /data-care-noscript/);
});
