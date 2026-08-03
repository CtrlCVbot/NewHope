import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";


async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the completed 새소망 방문요양 homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>새소망 방문요양 \| 익숙한 집에서 이어가는 오늘<\/title>/);
  assert.match(html, /익숙한 집에서,.*오늘의 삶을 이어갑니다/s);
  assert.match(html, /신체활동/);
  assert.match(html, /일상생활/);
  assert.match(html, /정서지원/);
  assert.match(html, /이야기 나누기/);
  assert.match(html, /외부로 전송되거나 저장되지 않습니다/);
  assert.match(html, /hero-care\.png/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("keeps interaction and accessibility contracts in source", async () => {
  const [page, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /document\.body\.classList\.toggle\("menu-open"/);
  assert.match(page, /event\.preventDefault\(\)/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /closeRef\.current\?\.focus\(\)/);
  assert.match(page, /trapMenuFocus/);
  assert.match(page, /IntersectionObserver/);
  assert.match(page, /marquee-group" aria-hidden="true"/);
  for (const label of ["방문요양", "일상생활 지원", "정서지원", "외출 동행"]) {
    assert.equal((page.match(new RegExp(label, "g")) ?? []).length >= 2, true);
  }
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /\.js-reveal \.reveal\.is-visible/);
  assert.match(css, /animation-play-state:paused/);
  assert.match(css, /min-height:44px/);
  assert.match(layout, /lang="ko"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
