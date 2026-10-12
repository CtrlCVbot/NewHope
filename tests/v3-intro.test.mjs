import test from "node:test";
import assert from "node:assert/strict";
import { render } from "./next-build-html.mjs";

test("server-renders a readable Intro in the existing 소개 anchor", async () => {
  const response = await render("/v3-design");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /<section id="소개"[^>]*data-v3-intro/);
  assert.match(html, /data-intro-label[^>]*>우리의 약속/);
  assert.match(html, /data-intro-headline[^>]*aria-label="마음을 듣고 함께하며, 편안한 하루를 오래 지켜갑니다\."/);
  assert.match(html, /data-intro-emphasis="true"/);
  assert.match(html, /data-intro-image="left"[^>]*>.*?alt="디자인 검토용 중립 이미지 자리 2"/);
  assert.match(html, /data-intro-image="right"[^>]*>.*?alt="디자인 검토용 중립 이미지 자리 3"/);
  assert.match(html, /data-intro-body[^>]*>한 사람의 익숙한 생활 리듬/);
  assert.equal((html.match(/<section id=/g) ?? []).length, 6);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
});
