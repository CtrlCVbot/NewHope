import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { render } from "./next-build-html.mjs";

test("renders the V3 frame and selected MaruBuri font comparison", async () => {
  const [frameResponse, fontsResponse] = await Promise.all([render("/v3-design"), render("/v3-design/fonts")]);
  const [frame, fonts] = await Promise.all([frameResponse.text(), fontsResponse.text()]);
  assert.equal(frameResponse.status, 200); assert.equal(fontsResponse.status, 200);
  assert.match(frame, /새소망 V3 디자인 프레임/); assert.match(frame, /data-v3-frame/); assert.match(frame, /data-v3-header/); assert.match(frame, /data-v3-menu-toggle/);
  assert.equal((frame.match(/<section id=/g) ?? []).length, 6);
  for (const id of ["소개", "서비스", "이용 안내", "이야기", "돌봄", "상담"]) assert.ok(frame.includes(`<section id="${id}"`));
  for (const candidate of ["noto-serif-kr", "maruburi", "nanum-myeongjo"]) assert.match(fonts, new RegExp(`data-font-candidate="${candidate}"`));
  assert.match(fonts, /기본 서체: MaruBuri/); assert.equal((fonts.match(/data-font-sample=/g) ?? []).length, 9);
});

test("keeps V3 content, font, and accessible frame contracts", async () => {
  const [types, placeholder, tokens, readme, frame, menu, smooth] = await Promise.all(["../content/v3/types.ts", "../content/v3/placeholder.ts", "../styles/v3/tokens.css", "../public/v3/fonts/README.md", "../components/v3/layout/V3Frame.tsx", "../components/v3/layout/MenuOverlay.tsx", "../components/v3/layout/SmoothScroll.tsx"].map((path) => readFile(new URL(path, import.meta.url), "utf8")));
  for (const field of ["brand:", "nav:", "hero:", "intro:", "feature:", "services:", "process:", "mission:", "care:", "why:", "cta:", "footer:"]) assert.match(types, new RegExp(field));
  const compiled = ts.transpileModule(placeholder, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText; const compiledModule = { exports: {} }; new Function("exports", "module", compiled)(compiledModule.exports, compiledModule); const { v3PlaceholderContent, v3PlaceholderPhotoSlots } = compiledModule.exports;
  assert.deepEqual([v3PlaceholderContent.nav.length, v3PlaceholderContent.feature.pills.length, v3PlaceholderContent.services.cards.length, v3PlaceholderContent.process.steps.length, v3PlaceholderContent.mission.items.length, v3PlaceholderContent.care.tabs.length, v3PlaceholderPhotoSlots.length], [6, 6, 3, 6, 7, 4, 14]);
  await Promise.all(v3PlaceholderPhotoSlots.map((image) => access(new URL(`../public${image.src}`, import.meta.url))));
  for (const token of ["#6c5275", "#3a1f3a", "#15031b", "#b0a1bf", "#f5f0eb", "#fbf8f5", "#74c1cd", "#c4a58a", '"MaruBuri WU0",serif']) assert.match(tokens, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const term of ["Noto Serif KR", "MaruBuri", "Nanum Myeongjo", "GSAP", "SHA-256"]) assert.match(readme, new RegExp(term));
  for (const term of ["inert={menuOpen", "setScrollLocked(true)", "setScrollLocked(false)", "scrollIntoView"]) assert.match(frame, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const term of ['role="dialog"', 'aria-modal="true"', 'event.key === "Escape"', "data-v3-menu-link"]) assert.match(menu, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const term of ["autoRaf: false", "lerp: 0.1", "syncTouch: false", "gsap.ticker.add", "gsap.ticker.remove", "instance?.stop()", "instance?.start()", "instance.destroy()"]) assert.match(smooth, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  await Promise.all(["NotoSerifKR-Variable.ttf", "MaruBuri-Regular.otf", "NanumMyeongjo-Regular.ttf", "PretendardVariable.woff2"].map((name) => access(new URL(`../public/v3/fonts/${name}`, import.meta.url))));
});
