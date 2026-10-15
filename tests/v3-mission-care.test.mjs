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

test("renders Saesomang manual Care tabs with readable HTML bodies and no timed progress", async () => {
  const response = await render("/v3");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /data-care-rotation="manual"/);
  assert.equal((html.match(/data-care-panel/g) ?? []).length, 4);
  assert.equal((html.match(/data-care-progress/g) ?? []).length, 0);
  assert.match(html, /궁금한 서비스 종류와 일반적인 이용 절차를 오픈채팅에서 확인합니다\./);
  assert.match(html, /실제 지도나 확정 방문 범위가 아닌 개념도입니다\./);
  assert.match(html, /data-care-noscript/);
});
