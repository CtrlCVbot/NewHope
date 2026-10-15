import { createHash } from "node:crypto";
import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const outputRoot = path.join(root, "public", "v3", "saesomang");
const imageRoot = path.join(outputRoot, "images");
const illustrationRoot = path.join(outputRoot, "illustrations");
const evidenceArgument = process.argv[2] === "--evidence" ? process.argv[3] : undefined;
if (process.argv.length > (evidenceArgument ? 4 : 2)) throw new Error("Usage: node scripts/build-v3-saesomang-assets.mjs [--evidence <path>]");
const evidenceRoot = evidenceArgument ? path.resolve(root, evidenceArgument) : undefined;
const assertWithin = (candidate, parent, label) => { const relative = path.relative(parent, candidate); if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`${label} escapes its allowed root`); };
if (evidenceRoot) assertWithin(evidenceRoot, path.resolve(root, "..", "docs"), "evidence");

const sources = {
  hero: { path: "public/hero-care.png", license: "기존 승인 자산, 사용자 재사용 권한 확인 2026-10-13" },
  cleaning: { path: "assets/v3/saesomang/source/cleaning-hands-blog.png", license: "블로그 원본, 사용자 재사용 권한 확인 2026-10-15" },
  bathing: { path: "public/service-bathing-v2.png", license: "기존 승인 자산, 사용자 재사용 권한 확인 2026-10-13" },
  companionship: { path: "public/service-companionship-v2.png", license: "기존 승인 자산, 사용자 재사용 권한 확인 2026-10-13" },
  hands: { path: "assets/v3/saesomang/source/hands-care-blog.png", license: "블로그 원본, 사용자 재사용 권한 확인 2026-10-15" },
  introFamilyConsultation: { path: "assets/v3/saesomang/source/wu24/intro-family-consultation.png", license: "사용자 요청으로 2026-10-15 built-in image_gen에서 만든 가상 장면 NH24-I04" },
  featureLivingConversation: { path: "assets/v3/saesomang/source/wu24/feature-living-conversation.png", license: "사용자 요청으로 2026-10-15 built-in image_gen에서 만든 가상 장면 NH24-F01" },
};
const photos = [
  ["hero", "hero", { left: 0, top: 18, width: 1536, height: 989 }, 1440, 927, "집 안에서 이동을 돕는 돌봄의 장면", "care-interaction"],
  ["card-1", "cleaning", { left: 0, top: 0, width: 966, height: 809 }, 900, 754, "집 안의 식탁을 닦으며 생활을 돕는 장면", "hands-and-face-preserved"],
  ["card-2", "bathing", { left: 0, top: 0, width: 1536, height: 1024 }, 1200, 800, "방문목욕 안내 장면", "bathing-care"],
  ["card-3", "companionship", { left: 0, top: 0, width: 1536, height: 1024 }, 1200, 800, "말벗과 생활을 살피는 장면", "care-interaction"],
  ["mission", "hands", { left: 0, top: 0, width: 966, height: 809 }, 966, 809, "손을 맞잡고 함께하는 돌봄의 장면", "full-hands-scene"],
  ["intro-family-consultation", "introFamilyConsultation", { left: 0, top: 0, width: 1536, height: 1024 }, 1200, 800, "가족이 함께 필요한 도움을 이야기하는 장면", "family-conversation"],
  ["feature-living-conversation", "featureLivingConversation", { left: 0, top: 0, width: 1536, height: 1024 }, 1200, 800, "거실에서 일상과 필요한 도움을 이야기하는 장면", "living-conversation"],
];
const diagrams = [
  ["intro-left", "intro-home.svg", "집 안에서 편안히 머무는 공간을 표현한 도해"], ["intro-right", "intro-conversation.svg", "대화와 안부를 나누는 돌봄을 표현한 도해"], ["feature", "feature-support.svg", "일상 지원을 표현한 도해"], ["services", "services-daily.svg", "하루의 생활 지원을 표현한 도해"], ["care-1", "care-start.svg", "돌봄 시작 단계를 표현한 도해"], ["care-2", "care-prepare.svg", "돌봄 준비 단계를 표현한 도해"], ["care-3", "care-region.svg", "방문 가능 지역을 표현한 도해"], ["care-4", "care-dialogue.svg", "상담과 대화를 표현한 도해"], ["why", "why-garden.svg", "집에서 자라는 일상을 표현한 도해"],
];
const sha256 = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const overwriteKnown = async (output, buffer) => { try { if ((await readFile(output)).equals(buffer)) return; } catch (error) { if (error.code !== "ENOENT") throw error; } for (let attempt = 0; attempt < 10; attempt += 1) { try { await unlink(output); break; } catch (error) { if (error.code === "ENOENT") break; if (!["EBUSY", "EPERM"].includes(error.code) || attempt === 9) throw error; await pause(100); } } await writeFile(output, buffer); };
const parseViewBox = (svg, file) => { const match = svg.match(/\bviewBox=["']\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*["']/i); if (!match) throw new Error(`${file} needs a zero-origin viewBox`); return { width: Number(match[1]), height: Number(match[2]) }; };
const validateSvg = (svg, file) => { if (/<script\b|<(?:image|use|foreignObject)\b|(?:href|xlink:href)\s*=/i.test(svg)) throw new Error(`${file} contains executable or external content`); };

await mkdir(imageRoot, { recursive: true });
if (evidenceRoot) await mkdir(evidenceRoot, { recursive: true });
for (const [name] of diagrams) for (const suffix of [".webp", "-1x.webp"]) try { await unlink(path.join(imageRoot, `${name}${suffix}`)); } catch (error) { if (error.code !== "ENOENT") throw error; }
const sourceMetadata = {};
for (const [sourceId, source] of Object.entries(sources)) { const absolute = path.join(root, source.path); const metadata = await sharp(absolute).metadata(); sourceMetadata[sourceId] = { ...source, sha256: await sha256(absolute), width: metadata.width, height: metadata.height }; }
const images = [];
for (const [name, sourceId, crop, width, height, alt, focalPoint] of photos) {
  const source = sourceMetadata[sourceId];
  if (width > crop.width || height > crop.height) throw new Error(`${name} would enlarge its source crop`);
  const output = path.join(imageRoot, `${name}.webp`);
  await overwriteKnown(output, await sharp(path.join(root, source.path)).extract(crop).resize(width, height, { fit: "fill", withoutEnlargement: true }).webp({ quality: 76, effort: 6, smartSubsample: true }).toBuffer());
  const metadata = await sharp(output).metadata(); const outputStat = await stat(output);
  images.push({ name, kind: "photo", sourceId, sourcePath: source.path, sourceSha256: source.sha256, sourceLicenseEvidence: source.license, alt, crop: { pixels: crop, focalPoint, preservesFullSource: name === "mission" }, actualDimensions: { width: metadata.width, height: metadata.height }, file: `images/${name}.webp`, bytes: outputStat.size });
}
for (const [name, file, alt] of diagrams) { const relative = `illustrations/${file}`; const svg = await readFile(path.join(illustrationRoot, file), "utf8"); validateSvg(svg, relative); const dimensions = parseViewBox(svg, relative); images.push({ name, kind: "diagram", sourceId: `illustration-${name}`, sourcePath: relative, sourceSha256: createHash("sha256").update(svg).digest("hex"), sourceLicenseEvidence: "프로젝트 고유 SVG 도해, 2026-10-15", alt, file: relative, ...dimensions, bytes: Buffer.byteLength(svg) }); }
const manifestPath = path.join(outputRoot, "assets-manifest.json");
const previous = JSON.parse(await readFile(manifestPath, "utf8"));
const manifest = { schemaVersion: 2, generatedBy: "scripts/build-v3-saesomang-assets.mjs", sourceType: "사진은 승인된 기존 자산·블로그 원본 또는 사용자 요청으로 만든 가상 생성 장면이며, 실제 직원 또는 센터 사진이라고 주장하지 않음", images, brand: previous.brand };
const brand = await sharp(await readFile(path.join(outputRoot, "brand", "why.svg"))).resize({ width: 660 }).png().toBuffer();
await overwriteKnown(path.join(outputRoot, "og.webp"), await sharp(path.join(root, sources.hero.path)).resize(1200, 630, { fit: "cover", position: "centre" }).composite([{ input: Buffer.from('<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#15031b" opacity=".58"/></svg>') }, { input: brand, left: 60, top: 58 }, { input: Buffer.from('<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><text x="60" y="510" fill="#ffffff" font-family="serif" font-size="52">익숙한 집에서, 편안한 하루를.</text></svg>') }]).webp({ quality: 76, effort: 6 }).toBuffer());
manifest.og = { file: "og.webp", width: 1200, height: 630, source: sources.hero.path, brand: "brand/why.svg", copy: "익숙한 집에서, 편안한 하루를." };
if (evidenceRoot) {
  const tiles = await Promise.all(photos.map(async ([name], index) => ({ input: await sharp(path.join(imageRoot, `${name}.webp`)).resize(240, 180, { fit: "contain", background: "#15031b" }).webp().toBuffer(), left: (index % 3) * 260, top: Math.floor(index / 3) * 220 })));
  const labels = photos.map(([name], index) => `<text x="${(index % 3) * 260 + 8}" y="${Math.floor(index / 3) * 220 + 205}" fill="white" font-size="15" font-family="sans-serif">${name}</text>`).join("");
  await overwriteKnown(path.join(evidenceRoot, "crop-preview.webp"), await sharp({ create: { width: 780, height: 440, channels: 4, background: "#17231f" } }).composite([...tiles, { input: Buffer.from(`<svg width="780" height="440" xmlns="http://www.w3.org/2000/svg">${labels}</svg>`) }]).webp({ quality: 82 }).toBuffer());
  try { await stat(path.join(evidenceRoot, "brand-preview.svg")); await overwriteKnown(path.join(evidenceRoot, "brand-preview.webp"), await sharp(path.join(evidenceRoot, "brand-preview.svg")).webp({ quality: 90 }).toBuffer()); } catch (error) { if (error.code !== "ENOENT") throw error; }
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
await writeFile(path.join(outputRoot, "README.md"), "# 새소망 2차 전용 자산\n\n- 생성일: 재현 가능한 script 출력(시간값 미기록)\n- 현재 `/v3` 화면은 hero, Intro, Feature, 서비스 카드 3장의 사진 6개를 각각 한 번 렌더링합니다. 사진은 승인된 기존 자산·블로그 원본·가상 생성 장면을 포함하며, 실제 직원 또는 센터 사진이라고 주장하지 않습니다.\n- `intro-family-consultation.webp` (NH24-I04)와 `feature-living-conversation.webp` (NH24-F01)는 사용자 요청으로 2026-10-15 built-in image_gen에서 만든 가상 장면입니다. F01의 원본·프롬프트·native 1536×1024 증거는 `docs/enhancement/2026-10-15/evidence/wu24/image-generation.json`에 있습니다.\n- 프로젝트 고유 SVG 도해 9개는 자산 catalog와 이전 구성 재현을 위해 보관합니다. 현재 `/v3` 화면에서는 요청하거나 렌더링하지 않습니다.\n- 블로그 원본 2개와 WU24 원본 2개는 `assets/v3/saesomang/source/`에 보관합니다. 기존 승인 사진 3개의 확인일은 2026-10-13입니다.\n- 사진 출력은 원본 crop보다 크게 만들지 않습니다. `mission`은 손을 맞잡은 장면 전체 비율을 보존합니다.\n- 원본 SHA-256, 권한 근거, crop, 실제 차원, 바이트는 `assets-manifest.json`에 있습니다.\n- 자산 catalog 전송 예산 2.5MB에는 WebP 7개, 보관 SVG 9개, OG가 포함됩니다. 현재 화면 요청은 활성 WebP 6개와 필요한 브랜드 자산으로 한정됩니다. 제작 원본 PNG는 별도입니다.\n", "utf8");
