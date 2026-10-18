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
const catalogPhotos = ["hero", "service-daily-living", "service-bath-preparation", "service-companionship", "mission", "mission-listening", "intro-family-consultation", "feature-living-conversation", "care-first-question", "care-preparing-notes", "care-planning-calendar", "care-everyday-checkin", "why-evening-home"];
const activePhotos = ["hero", "service-daily-living", "service-bath-preparation", "service-companionship", "mission-listening", "intro-family-consultation", "feature-living-conversation", "care-first-question", "care-preparing-notes", "care-planning-calendar", "care-everyday-checkin", "why-evening-home"];
const diagrams = { "intro-left": "intro-home.svg", "intro-right": "intro-conversation.svg", feature: "feature-support.svg", services: "services-daily.svg", "care-1": "care-start.svg", "care-2": "care-prepare.svg", "care-3": "care-region.svg", "care-4": "care-dialogue.svg", why: "why-garden.svg" };
const contentDiagrams = { "intro-left": "intro-home.svg", "intro-right": "intro-conversation.svg", feature: "feature-support.svg", services: "services-daily.svg" };
const loadManifest = async () => JSON.parse(await readFile(manifestPath, "utf8"));

test("maps thirteen catalog photos and nine unique SVG diagrams", async () => {
  const manifest = await loadManifest();
  assert.equal(manifest.schemaVersion, 2); assert.equal(manifest.images.length, 22);
  assert.deepEqual(manifest.images.filter(({ kind }) => kind === "photo").map(({ name }) => name).sort(), [...catalogPhotos].sort());
  assert.deepEqual(Object.fromEntries(manifest.images.filter(({ kind }) => kind === "diagram").map(({ name, file }) => [name, path.basename(file)])), diagrams);
  assert.equal(new Set(manifest.images.map(({ sourceSha256 }) => sourceSha256)).size, 22);
});
test("photo metadata and files prove no source enlargement", async () => {
  const manifest = await loadManifest();
  for (const image of manifest.images.filter(({ kind }) => kind === "photo")) { const metadata = await sharp(path.join(assets, image.file)).metadata(); assert.equal(metadata.format, "webp"); assert.deepEqual({ width: metadata.width, height: metadata.height }, image.actualDimensions); assert.ok(image.actualDimensions.width <= image.crop.pixels.width, `${image.name} width enlarged`); assert.ok(image.actualDimensions.height <= image.crop.pixels.height, `${image.name} height enlarged`); }
  for (const name of ["mission", "mission-listening", "care-first-question", "care-preparing-notes", "care-planning-calendar", "care-everyday-checkin", "why-evening-home"]) assert.equal(manifest.images.find((image) => image.name === name).crop.preservesFullSource, true);
});
test("maps the three service cards to the approved WU25 scenes at 3:2", async () => {
  const manifest = await loadManifest();
  const expected = [
    ["service-daily-living", "dailyLiving", "assets/v3/saesomang/source/wu25/NH24-I01-daily-living.png"],
    ["service-bath-preparation", "bathPreparation", "assets/v3/saesomang/source/wu25/NH24-I03-bath-preparation.png"],
    ["service-companionship", "companionship", "assets/v3/saesomang/source/wu25/NH24-I02-companionship.png"],
  ];
  for (const [name, sourceId, sourcePath] of expected) {
    const image = manifest.images.find((entry) => entry.name === name);
    assert.equal(image.sourceId, sourceId); assert.equal(image.sourcePath, sourcePath);
    assert.deepEqual(image.actualDimensions, { width: 1200, height: 800 });
    assert.deepEqual(image.crop.pixels, { left: 0, top: 0, width: 1536, height: 1024 }); assert.equal(image.crop.preservesFullSource, true);
  }
});
test("hashes, rights evidence, SVG dimensions, and SVG safety are recorded", async () => {
  const manifest = await loadManifest();
  for (const image of manifest.images) { assert.match(image.sourceSha256, /^[a-f0-9]{64}$/); assert.ok(image.sourceLicenseEvidence.length > 10); assert.doesNotMatch(JSON.stringify(image), /[A-Z]:\\|\/Users\//i); if (image.kind === "photo") assert.equal(createHash("sha256").update(await readFile(path.join(root, image.sourcePath))).digest("hex"), image.sourceSha256); else { const svg = await readFile(path.join(assets, image.file), "utf8"); assert.match(svg, /viewBox=["']0 0 [\d.]+ [\d.]+["']/); assert.doesNotMatch(svg, /<script\b|<(?:image|use|foreignObject)\b|(?:href|xlink:href)\s*=/i); assert.equal(createHash("sha256").update(svg).digest("hex"), image.sourceSha256); assert.ok(image.width > 0 && image.height > 0 && image.bytes > 0); } }
});
test("V3 content references each active photo once while retaining the catalog", async () => {
  const content = await readFile(path.join(root, "content", "v3", "saesomang.ts"), "utf8");
  for (const name of catalogPhotos) await stat(path.join(assets, "images", `${name}.webp`));
  for (const name of activePhotos) { const publicPath = `/v3/saesomang/images/${name}.webp`; assert.equal(content.split(publicPath).length - 1, 1, `${name} is active once`); }
  assert.equal(content.includes("/v3/saesomang/images/mission.webp"), false, "old mission remains catalog-only");
  for (const [, file] of Object.entries(diagrams)) await stat(path.join(assets, "illustrations", file));
  for (const [, file] of Object.entries(contentDiagrams)) { const publicPath = `/v3/saesomang/illustrations/${file}`; assert.ok(content.includes(publicPath), `${file} is referenced by V3 content`); }
});
test("keeps brand contract and active assets under the 2.5MB budget", async () => {
  const manifest = await loadManifest(); assert.equal(manifest.brand.externalReferences, 0); assert.deepEqual(manifest.brand.variants, ["header-full.svg", "header-short.svg", "menu.svg", "why.svg", "footer.svg"]); assert.deepEqual(manifest.brand.symbols, ["symbol.svg", "symbol-white.svg", "symbol-small.svg"]); assert.deepEqual(manifest.brand.icons, ["home.svg", "bath.svg", "chat.svg", "leaf.svg", "arrow-up-right.svg"]); assert.deepEqual(manifest.og, { file: "og.webp", width: 1200, height: 630, source: "public/hero-care.png", brand: "brand/why.svg", copy: "익숙한 집에서, 편안한 하루를." }); const active = await Promise.all([...manifest.images, { file: "og.webp" }].map(async ({ file }) => (await stat(path.join(assets, file))).size)); assert.ok(active.reduce((sum, bytes) => sum + bytes, 0) <= 2.5 * 1024 * 1024);
});

test("keeps eight outlined brand SVGs safe and the five service icons stable", async () => {
  const manifest = await loadManifest(); const names = [...manifest.brand.variants, ...manifest.brand.symbols]; assert.equal(names.length, 8); const iconHashes = await Promise.all(manifest.brand.icons.map(async (name) => createHash("sha256").update(await readFile(path.join(assets, "icons", name))).digest("hex")));
  for (const name of names) { const svg = await readFile(path.join(assets, "brand", name), "utf8"); assert.match(svg, /<title>[^<]+<\/title>/); assert.match(svg, /aria-label="[^"]+"/); assert.match(svg, /<path\b/); assert.doesNotMatch(svg, /<text\b|<(?:image|use|foreignObject|script)\b|(?:href|xlink:href)\s*=/i); }
  assert.equal(new Set(iconHashes).size, manifest.brand.icons.length);
});
test("keeps rasterized brand ink inside a transparent SVG border", async () => {
  const manifest = await loadManifest();
  for (const name of [...manifest.brand.variants, ...manifest.brand.symbols]) {
    const { data, info } = await sharp(path.join(assets, "brand", name)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const alpha = (x, y) => data[(y * info.width + x) * info.channels + 3];
    for (let x = 0; x < info.width; x += 1) assert.equal(alpha(x, 0), 0, `${name} touches its top border`);
    for (let x = 0; x < info.width; x += 1) assert.equal(alpha(x, info.height - 1), 0, `${name} touches its bottom border`);
    for (let y = 0; y < info.height; y += 1) assert.equal(alpha(0, y), 0, `${name} touches its left border`);
    for (let y = 0; y < info.height; y += 1) assert.equal(alpha(info.width - 1, y), 0, `${name} touches its right border`);
  }
});
test("regenerates identically and preserves existing unowned image files", async () => {
  const owned = ["assets-manifest.json", "README.md", "og.webp", ...catalogPhotos.map((name) => `images/${name}.webp`)]; const hashOwned = async () => Object.fromEntries(await Promise.all(owned.map(async (file) => [file, createHash("sha256").update(await readFile(path.join(assets, file))).digest("hex")]))); const preserved = path.join(assets, "images", "hero-1x.webp"); const preservedBefore = createHash("sha256").update(await readFile(preserved)).digest("hex"); const before = await hashOwned(); await execFile(process.execPath, [path.join(root, "scripts", "build-v3-saesomang-assets.mjs")], { cwd: root }); const afterFirst = await hashOwned(); await execFile(process.execPath, [path.join(root, "scripts", "build-v3-saesomang-assets.mjs")], { cwd: root }); assert.deepEqual(afterFirst, await hashOwned()); assert.deepEqual(before, afterFirst); assert.equal(createHash("sha256").update(await readFile(preserved)).digest("hex"), preservedBefore);
});
