import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { render } from "./next-build-html.mjs";

test("renders the V3 UI review route and required states", async () => {
  const response = await render("/v3-design/ui");
  const html = await response.text();
  assert.equal(response.status, 200);
  for (const state of ["default", "small", "gold", "glow", "button", "disabled-button", "disabled-link", "long-label"]) assert.match(html, new RegExp(`data-ui-demo=\\\"${state}\\\"`));
  for (const marker of ["data-v3-cta", "data-cta-arrow=\\\"first\\\"", "data-cta-arrow=\\\"second\\\"", "data-cta-glow", "data-ui-counter", "data-ui-target", "data-ui-richtext", "data-ui-leaf-list", "data-ui-glass-card", "data-ui-gold-label"]) assert.match(html, new RegExp(marker));
});

test("keeps reusable UI contracts safe and scoped", async () => {
  const [cta, richText, css, icon] = await Promise.all(["../components/v3/ui/CtaButton.tsx", "../components/v3/ui/RichText.tsx", "../components/v3/ui/ui.module.css", "../components/v3/ui/Icon.tsx"].map((path) => readFile(new URL(path, import.meta.url), "utf8")));
  assert.match(cta, /type=\{buttonProps.type \?\? "button"\}/);
  assert.match(cta, /aria-disabled/); assert.match(cta, /tabIndex=\{disabled \? -1/);
  assert.doesNotMatch(richText, /dangerouslySetInnerHTML/);
  for (const term of ["backdrop-filter:blur(20px)", "border-radius:0", "@property --v3-glow-angle", "animation:v3Glow 5s", "animation-duration:4s", "prefers-reduced-motion", "min-height:44px", "inset:0", "not([aria-disabled=true])"]) assert.match(css, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const term of ["useId", "v3-leaf-gold-${useId()", "strokeWidth={1.5}", "offset=\".0055\"", "offset=\".2477\"", "offset=\".6229\"", "offset=\".9744\""]) assert.match(icon, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("preserves repeated and literal RichText while escaping HTML-shaped text", async () => {
  const source = await readFile(new URL("../components/v3/ui/richTextSegments.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const compiledModule = { exports: {} }; new Function("exports", "module", js)(compiledModule.exports, compiledModule);
  const value = { text: "a+b / [x] <script> a+b", emphasis: ["a+b", "a", "[x]", "", "<script>"] };
  const segments = compiledModule.exports.richTextSegments(value);
  assert.equal(segments.map((segment) => segment.text).join(""), value.text);
  assert.deepEqual(segments.filter((segment) => segment.emphasized).map((segment) => segment.text), ["a+b", "[x]", "<script>", "a+b"]);
  const html = renderToStaticMarkup(React.createElement("span", null, segments.map((segment, index) => segment.emphasized ? React.createElement("em", { key: index }, segment.text) : segment.text)));
  assert.match(html, /&lt;script&gt;/); assert.doesNotMatch(html, /<script>/);
});
