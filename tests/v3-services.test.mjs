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

test("renders the Saesomang service card enhancement contract", async () => {
  const response = await render("/v3");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.equal((html.match(/data-services-card(?==)/g) ?? []).length, 3);
  assert.equal((html.match(/data-services-back(?==)/g) ?? []).length, 3);
  assert.equal((html.match(/data-services-front(?==)/g) ?? []).length, 3);
  assert.equal((html.match(/data-services-image(?==)/g) ?? []).length, 3);
  const toggles = [...html.matchAll(/<button\b(?=[^>]*data-services-toggle)[^>]*>/g)].map(([tag]) => tag);
  assert.equal(toggles.length, 3);
  for (const toggle of toggles) {
    assert.match(toggle, /aria-expanded="false"/);
    assert.match(toggle, /aria-controls="saesomang-service-card-\d-description"/);
    assert.match(toggle, /\shidden(?:="")?(?=\s|>)/);
  }
  for (const copy of ["집 안의 일상을 돕는 시간.", "목욕 준비부터, 궁금한 점을 차근차근.", "이야기를 나누고, 하루를 살피는 시간."]) assert.match(html, new RegExp(copy));
});
