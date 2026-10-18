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

test("renders WU-27 Why and consultation as a full-source photo and one Kakao link", async () => {
  const response = await render("/v3");
  const html = await response.text();
  assert.equal(response.status, 200);
  const whyStart = html.indexOf("data-v3-why");
  const ctaStart = html.indexOf('<section id="contact-cta"');
  const locationStart = html.indexOf('<section id="location"');
  assert.ok(whyStart >= 0 && ctaStart > whyStart && locationStart > ctaStart);
  const why = html.slice(whyStart, ctaStart);
  const consultation = html.slice(ctaStart, locationStart);
  assert.equal((why.match(/why-evening-home\.webp/g) ?? []).length, 1);
  assert.match(why, /loading="lazy"/);
  assert.match(why, /익숙한 일상에, 새소망이 함께합니다\./);
  assert.match(why, /어떤 서비스를 안내하는지, 어떻게 이용을 준비하는지 차근차근 알아보세요\./);
  assert.equal((consultation.match(/id="consult"/g) ?? []).length, 1);
  assert.match(consultation, /data-v3-consult/);
  const links = [...consultation.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].filter(([, href]) => href === "https://open.kakao.com/o/ggmGtL5e");
  assert.equal(links.length, 1);
  const describedBy = links[0][0].match(/aria-describedby="([^"]+)"/)?.[1];
  assert.ok(describedBy);
  assert.match(consultation, new RegExp(`id="${describedBy}"`));
  assert.match(consultation, /그룹방에는 연락처·건강정보·서류 사진을 올리지 마세요/);
});
