import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const assets = path.join(root, "public", "v3", "saesomang");
const manifestPath = path.join(assets, "assets-manifest.json");
const execFile = promisify(execFileCallback);
const photos = ["hero", "card-1", "card-2", "card-3", "mission"];
const diagrams = { "intro-left": "intro-home.svg", "intro-right": "intro-conversation.svg", feature: "feature-support.svg", services: "services-daily.svg", "care-1": "care-start.svg", "care-2": "care-prepare.svg", "care-3": "care-region.svg", "care-4": "care-dialogue.svg", why: "why-garden.svg" };
const loadManifest = async () => JSON.parse(await readFile(manifestPath, "utf8"));

test("maps five photos and nine unique SVG diagrams", async () => {
  const manifest = await loadManifest();
  assert.equal(manifest.schemaVersion, 2); assert.equal(manifest.images.length, 14);
  assert.deepEqual(manifest.images.filter(({ kind }) => kind === "photo").map(({ name }) => name).sort(), [...photos].sort());
  assert.deepEqual(Object.fromEntries(manifest.images.filter(({ kind }) => kind === "diagram").map(({ name, file }) => [name, path.basename(file)])), diagrams);
  assert.equal(new Set(manifest.images.map(({ sourceSha256 }) => sourceSha256)).size, 14);
});
test("photo metadata and files prove no source enlargement", async () => {
  const manifest = await loadManifest();
  for (const image of manifest.images.filter(({ kind }) => kind === "photo")) { const metadata = await sharp(path.join(assets, image.file)).metadata(); assert.equal(metadata.format, "webp"); assert.deepEqual({ width: metadata.width, height: metadata.height }, image.actualDimensions); assert.ok(image.actualDimensions.width <= image.crop.pixels.width, `${image.name} width enlarged`); assert.ok(image.actualDimensions.height <= image.crop.pixels.height, `${image.name} height enlarged`); }
  assert.equal(manifest.images.find(({ name }) => name === "mission").crop.preservesFullSource, true);
});
test("hashes, rights evidence, SVG dimensions, and SVG safety are recorded", async () => {
  const manifest = await loadManifest();
  for (const image of manifest.images) { assert.match(image.sourceSha256, /^[a-f0-9]{64}$/); assert.ok(image.sourceLicenseEvidence.length > 10); assert.doesNotMatch(JSON.stringify(image), /[A-Z]:\\|\/Users\//i); if (image.kind === "photo") assert.equal(createHash("sha256").update(await readFile(path.join(root, image.sourcePath))).digest("hex"), image.sourceSha256); else { const svg = await readFile(path.join(assets, image.file), "utf8"); assert.match(svg, /viewBox=["']0 0 [\d.]+ [\d.]+["']/); assert.doesNotMatch(svg, /<script\b|<(?:image|use|foreignObject)\b|(?:href|xlink:href)\s*=/i); assert.equal(createHash("sha256").update(svg).digest("hex"), image.sourceSha256); assert.ok(image.width > 0 && image.height > 0 && image.bytes > 0); } }
});
test("V3 content references all public files", async () => {
  const content = await readFile(path.join(root, "content", "v3", "saesomang.ts"), "utf8");
  for (const name of photos) { const publicPath = `/v3/saesomang/images/${name}.webp`; assert.ok(content.includes(publicPath), `${name} is referenced by V3 content`); await stat(path.join(assets, "images", `${name}.webp`)); }
  for (const [name, file] of Object.entries(diagrams)) { const publicPath = `/v3/saesomang/illustrations/${file}`; assert.ok(content.includes(publicPath), `${name} is referenced by V3 content`); await stat(path.join(assets, "illustrations", file)); }
});
test("keeps brand contract and active assets under the 2.5MB budget", async () => {
  const manifest = await loadManifest(); assert.equal(manifest.brand.externalReferences, 0); assert.deepEqual(manifest.og, { file: "og.webp", width: 1200, height: 630, source: "public/hero-care.png", brand: "brand/header-full.svg", copy: "익숙한 집에서, 편안한 하루를." }); const active = await Promise.all([...manifest.images, { file: "og.webp" }].map(async ({ file }) => (await stat(path.join(assets, file))).size)); assert.ok(active.reduce((sum, bytes) => sum + bytes, 0) <= 2.5 * 1024 * 1024);
});
test("regenerates identically and preserves an unowned image file", async () => {
  const owned = ["assets-manifest.json", "README.md", "og.webp", ...photos.map((name) => `images/${name}.webp`)]; const hashOwned = async () => Object.fromEntries(await Promise.all(owned.map(async (file) => [file, createHash("sha256").update(await readFile(path.join(assets, file))).digest("hex")]))); const preserved = path.join(assets, "images", "hero-1x.webp"); const preservedBefore = createHash("sha256").update(await readFile(preserved)).digest("hex"); const before = await hashOwned(); await execFile(process.execPath, [path.join(root, "scripts", "build-v3-saesomang-assets.mjs")], { cwd: root }); const afterFirst = await hashOwned(); await execFile(process.execPath, [path.join(root, "scripts", "build-v3-saesomang-assets.mjs")], { cwd: root }); assert.deepEqual(afterFirst, await hashOwned()); assert.deepEqual(before, afterFirst); assert.equal(createHash("sha256").update(await readFile(preserved)).digest("hex"), preservedBefore);
});
