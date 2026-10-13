import assert from "node:assert/strict";
import test from "node:test";
import { render } from "./next-build-html.mjs";

test("server-renders Process in the existing 이용 안내 anchor", async () => {
  const response = await render("/v3-design");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<section id="이용 안내"[^>]*data-v3-process/);
  assert.equal((html.match(/data-process-step(?==)/g) ?? []).length, 6);
  assert.match(html, /role="region"[^>]*aria-label="이용 순서의 길이와 위계를 검토합니다\."/);
  assert.match(html, /role="progressbar"[^>]*aria-valuemin="0"[^>]*aria-valuemax="100"[^>]*aria-valuenow="0"/);
  for (const id of ["소개", "서비스", "이용 안내", "이야기", "돌봄", "상담"]) assert.match(html, new RegExp(`<section id="${id}"`));
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
});
