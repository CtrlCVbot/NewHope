import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import * as ReactDom from "react-dom";

const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "public", "v3", "saesomang", "fonts");
const manifest = JSON.parse(await readFile(path.join(output, "font-manifest.json"), "utf8"));
const expected = {
  SaesomangSansSubset: { family: "NewHope Saesomang Sans", weight: "45 930" },
  SaesomangSerifSubset: { family: "NewHope Saesomang Serif", weight: "400" },
};
const hash = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const normalizeCssLineEndings = (bytes) => Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"), "utf8");
const protectedHash = async (relative) => {
  const bytes = await readFile(path.join(root, relative));
  const normalized = relative === "styles/v3/font-subsets.css" ? normalizeCssLineEndings(bytes) : bytes;
  return createHash("sha256").update(normalized).digest("hex");
};

test("ships two independent WOFF2 subsets below the target budget", async () => {
  assert.equal(manifest.repeat_hash_match, true);
  let total = 0;
  for (const [name, contract] of Object.entries(expected)) {
    const file = path.join(output, `${name}.woff2`);
    const data = await readFile(file);
    assert.deepEqual(data.subarray(0, 4), Buffer.from("wOF2"));
    total += data.length;
    const result = manifest.results.find((item) => item.output.endsWith(`${name}.woff2`));
    assert.equal(result.name_family, contract.family);
    assert.equal(result.output_sha256, await hash(file));
    assert.ok(result.covered_codepoints > 95);
    assert.deepEqual(result.missing_codepoints, []);
  }
  assert.ok(total <= 300 * 1024, `subset total ${total} exceeds 300KB`);
});

test("connects CSS and V3 preload calls to only the Saesomang subset files", async () => {
  const [css, layout, page] = await Promise.all([
    readFile(path.join(root, "styles", "v3", "saesomang-fonts.css"), "utf8"),
    readFile(path.join(root, "app", "v3", "layout.tsx"), "utf8"),
    readFile(path.join(root, "app", "v3", "page.tsx"), "utf8"),
  ]);
  assert.match(layout, /saesomang-fonts\.css/);
  for (const [name, contract] of Object.entries(expected)) {
    assert.match(css, new RegExp(`font-family:"${contract.family}"`));
    assert.match(css, new RegExp(`${name}\\.woff2`));
    assert.match(css, new RegExp(`font-weight:${contract.weight}`));
    assert.match(page, new RegExp(`/v3/saesomang/fonts/${name}\\.woff2`));
  }
  assert.match(page, /preload\(/);
  assert.match(page, /from "react-dom"/);
  assert.equal(typeof ReactDom.preload, "function");
  assert.match(css, /unicode-range:U\+0020-007E/);
});

test("keeps the generator manifest guard before any protected output work", async () => {
  const generator = await readFile(path.join(root, "scripts", "build-v3-saesomang-fonts.py"), "utf8");
  assert.match(generator, /def manifest_path/);
  assert.match(generator, /candidate == MANIFEST\.resolve\(\)/);
  assert.match(generator, /assert_contained\(candidate, EVIDENCE_ROOT\.resolve\(\), "manifest"\)/);
  assert.match(generator, /args\.manifest = manifest_path\(args\.manifest\)/);
});

test("keeps protected first-generation font files and stylesheet hashes recorded", async () => {
  for (const [relative, expectedHash] of Object.entries(manifest.protected_sha256)) {
    assert.equal(await protectedHash(relative), expectedHash, `${relative} changed`);
  }
  assert.deepEqual(manifest.protected_sha256_policy, { binary_assets: "exact file bytes", "styles/v3/font-subsets.css": "UTF-8 bytes with CRLF normalized to LF only" });
  const css = await readFile(path.join(root, "styles", "v3", "font-subsets.css"), "utf8");
  const normalized = css.replace(/\r\n/g, "\n");
  assert.equal(createHash("sha256").update(normalizeCssLineEndings(Buffer.from(normalized))).digest("hex"), createHash("sha256").update(normalizeCssLineEndings(Buffer.from(normalized.replace(/\n/g, "\r\n")))).digest("hex"));
  assert.notEqual(createHash("sha256").update(normalized).digest("hex"), createHash("sha256").update(`${normalized}x`).digest("hex"));
  assert.equal((await stat(path.join(output, "SaesomangSansSubset.woff2"))).isFile(), true);
});

test("copies both source licenses byte-for-byte with local regeneration instructions", async () => {
  for (const file of ["LICENSE-Pretendard.txt", "LICENSE-MaruBuri-NAVER.txt"]) {
    assert.deepEqual(await readFile(path.join(output, file)), await readFile(path.join(root, "public", "v3", "fonts", file)));
  }
  const readme = await readFile(path.join(output, "README.md"), "utf8");
  assert.match(readme, /build-v3-saesomang-fonts\.py/);
  assert.match(readme, /fallback/);
});
