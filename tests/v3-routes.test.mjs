import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { render } from "./next-build-html.mjs";

test("renders the V3 font-comparison route without selecting G-FONT", async () => {
  const response = await render("/v3-design");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /<title>V3 디자인 서체 비교 \| 새소망 방문요양센터<\/title>/);
  for (const text of ["Noto Serif KR", "MaruBuri", "Nanum Myeongjo", "아직 서체를 선택하지 않았습니다", "같은 굵기 400", "#6c5275", "익숙한 자리에서 이어지는 오늘"]) assert.match(html, new RegExp(text));
  assert.match(html, /data-font-candidate="noto-serif-kr"/);
  assert.match(html, /data-font-candidate="maruburi"/);
  assert.match(html, /data-font-candidate="nanum-myeongjo"/);
  assert.equal((html.match(/data-font-sample=/g) ?? []).length, 9);
});

test("keeps V3 data, style isolation, and font-provenance contracts", async () => {
  const [types, placeholder, tokens, readme, page] = await Promise.all([
    readFile(new URL("../content/v3/types.ts", import.meta.url), "utf8"),
    readFile(new URL("../content/v3/placeholder.ts", import.meta.url), "utf8"),
    readFile(new URL("../styles/v3/tokens.css", import.meta.url), "utf8"),
    readFile(new URL("../public/v3/fonts/README.md", import.meta.url), "utf8"),
    readFile(new URL("../app/v3-design/page.tsx", import.meta.url), "utf8"),
  ]);
  for (const field of ["brand:", "nav:", "hero:", "intro:", "feature:", "services:", "process:", "mission:", "care:", "why:", "cta:", "footer:"]) assert.match(types, new RegExp(field));
  const compiled = ts.transpileModule(placeholder, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const compiledModule = { exports: {} };
  new Function("exports", "module", compiled)(compiledModule.exports, compiledModule);
  const { v3PlaceholderContent, v3PlaceholderPhotoSlots } = compiledModule.exports;
  assert.equal(v3PlaceholderContent.nav.length, 6);
  assert.equal(v3PlaceholderContent.feature.pills.length, 6);
  assert.equal(v3PlaceholderContent.services.cards.length, 3);
  assert.equal(v3PlaceholderContent.process.steps.length, 6);
  assert.equal(v3PlaceholderContent.mission.items.length, 7);
  assert.equal(v3PlaceholderContent.care.tabs.length, 4);
  assert.equal(v3PlaceholderPhotoSlots.length, 14);
  assert.deepEqual(v3PlaceholderPhotoSlots.map((image) => image.src), Array.from({ length: 14 }, (_, index) => `/v3/placeholders/slot-${String(index + 1).padStart(2, "0")}.svg`));
  await Promise.all(v3PlaceholderPhotoSlots.map((image) => access(new URL(`../public${image.src}`, import.meta.url))));
  for (const token of ["#6c5275", "#3a1f3a", "#15031b", "#b0a1bf", "#f5f0eb", "#fbf8f5", "#74c1cd", "#c4a58a"]) assert.match(tokens, new RegExp(token));
  for (const term of ["Noto Serif KR", "MaruBuri", "Nanum Myeongjo", "GSAP", "SHA-256"]) assert.match(readme, new RegExp(term));
  assert.match(page, /data-font-sample="hero"/);
  assert.match(page, /data-font-sample="section"/);
  assert.match(page, /data-font-sample="body"/);
  await Promise.all([access(new URL("../public/v3/fonts/NotoSerifKR-Variable.ttf", import.meta.url)), access(new URL("../public/v3/fonts/MaruBuri-Regular.otf", import.meta.url)), access(new URL("../public/v3/fonts/NanumMyeongjo-Regular.ttf", import.meta.url)), access(new URL("../public/v3/fonts/PretendardVariable.woff2", import.meta.url))]);
});
