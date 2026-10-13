import assert from "node:assert/strict";
import test from "node:test";
import { render } from "./next-build-html.mjs";

test("renders the integrated services SSR contract", async () => {
  const response = await render("/v3-design");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  for (const id of ["소개", "서비스", "이용 안내", "이야기", "돌봄", "상담"]) assert.match(html, new RegExp(`<section id="${id}"`));
  for (const marker of ["data-v3-services", "data-services-statement", "data-services-lead", "data-services-cards"]) assert.match(html, new RegExp(marker));
  assert.equal((html.match(/data-services-card(?==)/g) ?? []).length, 3);
  assert.match(html, /돌봄의 장면/);
  for (const slot of ["slot-05.svg", "slot-06.svg", "slot-07.svg", "slot-08.svg"]) assert.match(html, new RegExp(slot));
});
