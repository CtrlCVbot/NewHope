import assert from "node:assert/strict";
import test from "node:test";
import { render } from "./next-build-html.mjs";

test("renders the integrated Why and CTA SSR contract", async () => {
  const response = await render("/v3-design");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  for (const id of ["소개", "서비스", "이용 안내", "이야기", "돌봄", "상담"]) assert.match(html, new RegExp(`<section id="${id}"`));
  for (const marker of ["data-v3-why", "data-why-logo", "data-why-title", "data-why-body", "data-why-footnote", "data-v3-cta-section", "data-cta-section-spotlight", "data-cta-section-heading", "data-cta-section-body", "data-cta-section-button", "data-v3-cta"]) assert.match(html, new RegExp(marker));
  for (const asset of ["wordmark.svg", "slot-14.svg"]) assert.match(html, new RegExp(asset));
  assert.match(html, /하루의 마음을 살피며/);
  assert.match(html, /필요한 이야기를/);
});
