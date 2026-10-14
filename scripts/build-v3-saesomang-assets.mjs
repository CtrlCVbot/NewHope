import { createHash } from "node:crypto";
import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const outputRoot = path.join(root, "public", "v3", "saesomang");
const imageRoot = path.join(outputRoot, "images");
const evidenceArgument = process.argv[2] === "--evidence" ? process.argv[3] : undefined;
if (process.argv.length > (evidenceArgument ? 4 : 2)) throw new Error("Usage: node scripts/build-v3-saesomang-assets.mjs [--evidence <path>]");
const evidenceRoot = evidenceArgument ? path.resolve(root, evidenceArgument) : undefined;
const assertWithin = (candidate, parent, label) => {
  const relative = path.relative(parent, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`${label} escapes its allowed root`);
};
assertWithin(outputRoot, path.join(root, "public", "v3", "saesomang"), "output");
if (evidenceRoot) assertWithin(evidenceRoot, path.resolve(root, "..", "docs"), "evidence");

const sources = {
  hero: "public/hero-care.png",
  homecare: "public/service-homecare-v2.png",
  bathing: "public/service-bathing-v2.png",
  companionship: "public/service-companionship-v2.png",
};

// Crop rectangles are normalized against the 1536 x 1024 approved sources.
// They keep the visible care interaction centered while matching each target ratio.
const slots = [
  ["hero", "hero", 1440, 927, { left: 0.00, top: 0.02, width: 1.00, height: 0.96 }, "집 안에서 이동을 돕는 돌봄의 장면"],
  ["intro-left", "companionship", 338, 670, { left: 0.50, top: 0.00, width: 0.31, height: 1.00 }, "어르신과 대화하며 생활을 살피는 장면"],
  ["intro-right", "homecare", 496, 519, { left: 0.30, top: 0.00, width: 0.67, height: 1.00 }, "일상 활동을 돕는 돌봄의 장면"],
  ["feature", "hero", 1232, 928, { left: 0.00, top: 0.00, width: 1.00, height: 1.00 }, "집 안에서 이동을 돕는 돌봄의 장면"],
  ["services", "homecare", 880, 1360, { left: 0.44, top: 0.00, width: 0.52, height: 1.00 }, "생활 가까이 필요한 도움을 살피는 장면"],
  ["card-1", "homecare", 928, 1232, { left: 0.40, top: 0.00, width: 0.60, height: 1.00 }, "방문요양으로 일상을 돕는 장면"],
  ["card-2", "bathing", 928, 1232, { left: 0.40, top: 0.00, width: 0.60, height: 1.00 }, "방문목욕 안내 장면"],
  ["card-3", "companionship", 928, 1232, { left: 0.38, top: 0.00, width: 0.62, height: 1.00 }, "말벗과 생활을 살피는 장면"],
  ["mission", "companionship", 880, 1764, { left: 0.50, top: 0.00, width: 0.36, height: 1.00 }, "대화하며 함께하는 돌봄의 장면"],
  ["care-1", "hero", 674, 927, { left: 0.36, top: 0.00, width: 0.64, height: 1.00 }, "가족 같은 마음으로 이동을 돕는 장면"],
  ["care-2", "homecare", 674, 927, { left: 0.38, top: 0.00, width: 0.62, height: 1.00 }, "생활 가까이 필요한 도움을 살피는 장면"],
  ["care-3", "bathing", 674, 927, { left: 0.38, top: 0.00, width: 0.62, height: 1.00 }, "방문목욕 안내 장면"],
  ["care-4", "companionship", 1232, 928, { left: 0.00, top: 0.00, width: 1.00, height: 1.00 }, "편안한 일상을 함께하는 대화 장면"],
  ["why", "companionship", 1920, 1266, { left: 0.00, top: 0.04, width: 1.00, height: 0.92 }, "어르신의 이야기를 듣는 돌봄의 장면"],
];

const sha256 = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const toPixels = (rect, metadata) => ({
  left: Math.round(rect.left * metadata.width), top: Math.round(rect.top * metadata.height),
  width: Math.round(rect.width * metadata.width), height: Math.round(rect.height * metadata.height),
});
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const overwriteKnown = async (output, pipeline) => {
  const next = await pipeline.toBuffer();
  try {
    if ((await readFile(output)).equals(next)) return;
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try { await unlink(output); break; } catch (error) {
      if (error.code === "ENOENT") break;
      if (!["EBUSY", "EPERM"].includes(error.code) || attempt === 9) throw error;
      await pause(100);
    }
  }
  return writeFile(output, next);
};
const crop = async (input, rect, target, output) => overwriteKnown(output, sharp(input)
  .extract(rect).resize(target.width, target.height, { fit: "cover", position: "centre" })
  .webp({ quality: 72, effort: 6, smartSubsample: true }));

await mkdir(imageRoot, { recursive: true });
if (evidenceRoot) await mkdir(evidenceRoot, { recursive: true });

const sourceMetadata = {};
for (const [name, relative] of Object.entries(sources)) {
  const absolute = path.join(root, relative);
  const metadata = await sharp(absolute).metadata();
  sourceMetadata[name] = { path: relative, sha256: await sha256(absolute), width: metadata.width, height: metadata.height };
}

const images = [];
for (const [name, source, width, height, normalizedCrop, alt] of slots) {
  const input = path.join(root, sources[source]);
  const sourceInfo = sourceMetadata[source];
  const extract = toPixels(normalizedCrop, sourceInfo);
  const target = { width, height };
  await crop(input, extract, target, path.join(imageRoot, `${name}-1x.webp`));
  await crop(input, extract, { width: width * 2, height: height * 2 }, path.join(imageRoot, `${name}.webp`));
  const [oneX, twoX] = await Promise.all([stat(path.join(imageRoot, `${name}-1x.webp`)), stat(path.join(imageRoot, `${name}.webp`))]);
  images.push({ name, role: name, alt, source, sourcePath: sources[source], sourceSha256: sourceInfo.sha256, sourceLicenseEvidence: "사용자 재사용 권한 확인 2026-10-13", crop: { normalized: normalizedCrop, pixels: extract, focalPoint: name === "mission" ? "caregiver-and-elder-conversation" : "care-interaction" }, oneX: { file: `images/${name}-1x.webp`, width, height, bytes: oneX.size }, twoX: { file: `images/${name}.webp`, width: width * 2, height: height * 2, bytes: twoX.size } });
}

if (evidenceRoot) {
  const previewTiles = await Promise.all(images.map(async ({ name }, index) => ({ input: await sharp(path.join(imageRoot, `${name}-1x.webp`)).resize(240, 180, { fit: "contain", background: "#15031b" }).webp().toBuffer(), left: (index % 4) * 260, top: Math.floor(index / 4) * 220 })));
  const labels = images.map(({ name }, index) => `<text x="${(index % 4) * 260 + 8}" y="${Math.floor(index / 4) * 220 + 205}" fill="white" font-size="15" font-family="sans-serif">${name}</text>`).join("");
  await overwriteKnown(path.join(evidenceRoot, "crop-preview.webp"), sharp({ create: { width: 1040, height: 880, channels: 4, background: "#17231f" } }).composite([...previewTiles, { input: Buffer.from(`<svg width="1040" height="880" xmlns="http://www.w3.org/2000/svg">${labels}</svg>`) }]).webp({ quality: 82 }));
}

const manifest = {
  schemaVersion: 1, generatedBy: "scripts/build-v3-saesomang-assets.mjs", sourceLicenseEvidence: "사용자 재사용 권한 확인 2026-10-13", sourceType: "원본의 촬영 또는 생성 여부는 확인하지 않음", note: "2x 출력은 1536x1024 원본을 확대하며 새 디테일을 만들지 않습니다.", images,
};
try {
  const previous = JSON.parse(await readFile(path.join(outputRoot, "assets-manifest.json"), "utf8"));
  if (previous.brand) manifest.brand = previous.brand;
} catch { /* The first asset generation has no brand manifest yet. */ }
const headerBrand = path.join(outputRoot, "brand", "header-full.svg");
try {
  await stat(headerBrand);
  const brand = await readFile(headerBrand);
  await overwriteKnown(path.join(outputRoot, "og.webp"), sharp(path.join(root, sources.hero)).resize(1200, 630, { fit: "cover", position: "centre" })
    .composite([
      { input: Buffer.from('<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#15031b" opacity=".54"/></svg>') },
      { input: brand, left: 60, top: 62 },
      { input: Buffer.from('<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><text x="60" y="490" fill="#ffffff" font-family="serif" font-size="52" font-weight="400">익숙한 집에서, 오늘의 삶을 이어갑니다.</text><text x="60" y="548" fill="#ffffff" font-family="serif" font-size="25" font-weight="400">새소망 방문요양센터</text></svg>') },
    ]).webp({ quality: 76, effort: 6 }));
  manifest.og = { file: "og.webp", width: 1200, height: 630, source: sources.hero, brand: "brand/header-full.svg", copy: "익숙한 집에서, 오늘의 삶을 이어갑니다." };
  if (evidenceRoot) await overwriteKnown(path.join(evidenceRoot, "brand-preview.webp"), sharp(path.join(evidenceRoot, "brand-preview.svg")).webp({ quality: 90 }));
} catch (error) {
  try { await stat(headerBrand); } catch { /* Brand output has not been generated yet. */ }
  try { await stat(headerBrand); throw error; } catch (missing) { if (missing === error) throw error; }
}
await writeFile(path.join(outputRoot, "assets-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
await writeFile(path.join(outputRoot, "README.md"), "# 새소망 2차 전용 자산\n\n- 생성일: 재현 가능한 script 출력(시간값 미기록)\n- 사진 출처: 기존 public PNG 4종. 사용자 재사용 권한 확인일: 2026-10-13. 촬영/생성 여부는 확인하지 않았습니다.\n- `*.webp`는 2x 크기, `*-1x.webp`는 1x 크기입니다. 2x 확대는 새 디테일을 만들지 않습니다.\n- 원본 SHA-256, crop, 차원, 바이트는 `assets-manifest.json`에 있습니다.\n- 원본 PNG, 기존 1차 자산과 폰트는 수정하지 않습니다.\n", "utf8");
