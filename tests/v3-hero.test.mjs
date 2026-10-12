import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { render } from "./next-build-html.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("server-renders a readable V3 Hero while keeping the six frame anchors", async () => {
  const response = await render("/v3-design");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  for (const marker of ["data-v3-hero", "data-hero-bg", "data-hero-line", "data-hero-subtitle", "data-hero-card", "data-hero-popover", "data-hero-scroll"]) assert.match(html, new RegExp(marker));
  assert.match(html, /디자인 검토용 중립 이미지 자리 1/);
  assert.equal((html.match(/<section id=/g) ?? []).length, 6);
  assert.doesNotMatch(html, /data-v3-loader/);
});

test("Hero and loader keep reduced motion and storage failures non-blocking", async () => {
  const [hero, loader, css] = await Promise.all([
    read("../components/v3/sections/Hero.tsx"),
    read("../components/v3/layout/PageLoader.tsx"),
    read("../components/v3/sections/hero.module.css"),
  ]);
  assert.match(hero, /useReducedMotion/);
  assert.match(hero, /document\.fonts\.ready/);
  assert.match(loader, /catch \{ finish\(\); return; \}/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
