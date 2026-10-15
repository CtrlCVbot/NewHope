import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("permits only the WU18 revision query for local Saesomang photo assets", async () => {
  const source = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
  assert.match(source, /\{ pathname: "\/\*\*", search: "" \}/);
  assert.match(source, /\{ pathname: "\/v3\/saesomang\/images\/\*\.webp", search: "\?v=wu18-20261015" \}/);
  assert.doesNotMatch(source, /remotePatterns/);
});
