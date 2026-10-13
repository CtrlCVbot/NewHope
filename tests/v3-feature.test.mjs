import test from "node:test";
import assert from "node:assert/strict";
import { render } from "./next-build-html.mjs";

test("server-renders a readable Feature after the existing 소개 anchor", async () => {
  const response = await render("/v3-design");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /data-v3-feature/);
  assert.match(html, /data-feature-copy[^>]*>필요한 순간에도 부담 없이 살펴볼 수 있도록/);
  const cardIntro = html.match(/<p\b(?=[^>]*\bdata-feature-card-intro\b)[^>]*>([\s\S]*?)<\/p>/);
  assert.ok(cardIntro, "Feature card intro p marker is server-rendered");
  const cardIntroText = cardIntro[1].replace(/<[^>]*>/g, "").trim();
  assert.match(cardIntroText, /일상의 작은 변화와 가족의 마음을 함께 살피며/);
  assert.equal((html.match(/data-feature-pill/g) ?? []).length, 6);
  assert.match(html, /data-feature-bg/);
  assert.equal((html.match(/<section id=/g) ?? []).length, 6);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
});
