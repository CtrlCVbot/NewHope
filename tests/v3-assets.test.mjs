import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const assets = path.join(root, "public", "v3", "saesomang");
const manifest = JSON.parse(await readFile(path.join(assets, "assets-manifest.json"), "utf8"));
const execFile = promisify(execFileCallback);
const expected = {
  hero: [1440, 927], "intro-left": [338, 670], "intro-right": [496, 519], feature: [1232, 928], services: [880, 1360],
  "card-1": [928, 1232], "card-2": [928, 1232], "card-3": [928, 1232], mission: [880, 1764],
  "care-1": [674, 927], "care-2": [674, 927], "care-3": [674, 927], "care-4": [1232, 928], why: [1920, 1266],
};

test("creates fourteen approved photo positions with valid 1x and 2x WebP metadata", async () => {
  assert.equal(manifest.images.length, 14);
  assert.deepEqual(manifest.images.map(({ name }) => name).sort(), Object.keys(expected).sort());
  for (const image of manifest.images) {
    assert.deepEqual([image.oneX.width, image.oneX.height], expected[image.name], `${image.name} independent 1x spec`);
    for (const [key, scale] of [["oneX", 1], ["twoX", 2]]) {
      const file = path.join(assets, image[key].file);
      const metadata = await sharp(file).metadata();
      assert.equal(metadata.format, "webp", `${image.name} ${key} format`);
      assert.equal(metadata.width, image.oneX.width * scale, `${image.name} ${key} width`);
      assert.equal(metadata.height, image.oneX.height * scale, `${image.name} ${key} height`);
      assert.ok(Math.abs(metadata.width / metadata.height - image.oneX.width / image.oneX.height) < 0.001, `${image.name} ratio`);
    }
    assert.match(image.sourceSha256, /^[a-f0-9]{64}$/);
    assert.ok(image.alt.length > 4);
  }
});

test("has all fourteen content paths and actual files", async () => {
  const content = await readFile(path.join(root, "content", "v3", "saesomang.ts"), "utf8");
  for (const name of Object.keys(expected)) {
    const publicPath = `/v3/saesomang/images/${name}.webp`;
    assert.ok(content.includes(publicPath), `${name} is referenced by V3 content`);
    await stat(path.join(assets, "images", `${name}.webp`));
  }
});

test("keeps images and generated OG under the 2.5MB asset budget", async () => {
  const files = await readdir(path.join(assets, "images"));
  const sizes = await Promise.all(files.filter((file) => file.endsWith(".webp")).map(async (file) => (await stat(path.join(assets, "images", file))).size));
  const og = await stat(path.join(assets, "og.webp"));
  assert.deepEqual(manifest.og, { file: "og.webp", width: 1200, height: 630, source: "public/hero-care.png", brand: "brand/header-full.svg", copy: "익숙한 집에서, 오늘의 삶을 이어갑니다." });
  assert.ok(sizes.reduce((total, size) => total + size, og.size) <= 2.5 * 1024 * 1024);
});

test("brand and icon SVGs are path-only and free of external references", async () => {
  assert.equal(manifest.brand.externalReferences, 0);
  const allowedHex = new Set(["#6c5275", "#b0a1bf", "#ffffff"]);
  for (const file of [...manifest.brand.variants, ...manifest.brand.icons.map((name) => `../icons/${name}`)]) {
    const svg = await readFile(path.join(assets, "brand", file), "utf8");
    assert.match(svg, /viewBox=/);
    assert.match(svg, /<title>/);
    assert.match(svg, /<path /);
    assert.doesNotMatch(svg, /<(text|image|use|foreignObject)\b|(?:href|xlink:href)=["'](?:https?:|\/)|url\(/i);
    for (const hex of svg.match(/#[0-9a-f]{6}/gi) ?? []) assert.ok(allowedHex.has(hex.toLowerCase()), `${file} uses approved palette only`);
  }
});

test("records the unchanged approved source hashes without absolute paths", async () => {
  for (const image of manifest.images) {
    const source = await readFile(path.join(root, image.sourcePath));
    assert.equal(createHash("sha256").update(source).digest("hex"), image.sourceSha256);
    assert.doesNotMatch(JSON.stringify(image), /[A-Z]:\\|\/Users\//i);
  }
});

test("rebuilds the explicitly owned asset files deterministically without deleting unknown files", async () => {
  const owned = ["assets-manifest.json", "README.md", "og.webp", ...Object.keys(expected).flatMap((name) => [`images/${name}.webp`, `images/${name}-1x.webp`])];
  const hashOwned = async () => Object.fromEntries(await Promise.all(owned.map(async (file) => [file, createHash("sha256").update(await readFile(path.join(assets, file))).digest("hex")])));
  const before = await hashOwned();
  await execFile(process.execPath, [path.join(root, "scripts", "build-v3-saesomang-assets.mjs")], { cwd: root });
  const afterFirst = await hashOwned();
  await execFile(process.execPath, [path.join(root, "scripts", "build-v3-saesomang-assets.mjs")], { cwd: root });
  assert.deepEqual(afterFirst, await hashOwned());
  assert.deepEqual(before, afterFirst);
});
