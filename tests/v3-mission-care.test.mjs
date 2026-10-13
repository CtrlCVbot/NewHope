import test from "node:test";
import assert from "node:assert/strict";
import { render } from "./next-build-html.mjs";

test("server-renders Mission and Care with their accessible content contracts", async () => {
  const response = await render("/v3-design");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /data-v3-mission/);
  assert.equal((html.match(/data-mission-item/g) ?? []).length, 7);
  assert.match(html, /data-v3-care/);
  assert.match(html, /data-care-current/);
  assert.equal((html.match(/\bdata-care-tab(?:[=\s>])/g) ?? []).length, 4);
  assert.equal((html.match(/data-care-panel/g) ?? []).length, 4);
  assert.equal((html.match(/data-care-image/g) ?? []).length, 4);
  assert.equal((html.match(/data-care-progress/g) ?? []).length, 4);
  for (const slot of [9, 10, 11, 12, 13]) assert.match(html, new RegExp(`slot-${String(slot).padStart(2, "0")}\\.svg`));
  assert.equal((html.match(/<section id=/g) ?? []).length, 6);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
});
