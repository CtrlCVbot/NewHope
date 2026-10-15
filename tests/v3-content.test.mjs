import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const loadTsModule = async (path) => {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const cjsModule = { exports: {} };
  new Function("exports", "module", compiled)(cjsModule.exports, cjsModule);
  return cjsModule.exports;
};
const extractV1Array = (source, name) => {
  const match = source.match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\]) as const;`));
  assert.ok(match, `V1 ${name} array must exist`);
  return new Function(`return (${match[1]})`)();
};

test("maps the approved V3 contract, brand paths, pending facts, and Kakao consultation route", async () => {
  const [{ v3PlaceholderContent }, { KAKAO_OPEN_CHAT_URL, saesomangBrandAssets, saesomangContent, saesomangPhotoSlots, pendingFactChecks }] = await Promise.all([
    loadTsModule("../content/v3/placeholder.ts"), loadTsModule("../content/v3/saesomang.ts"),
  ]);
  assert.deepEqual(Object.keys(saesomangContent).filter((key) => key !== "extras").sort(), Object.keys(v3PlaceholderContent).filter((key) => key !== "extras").sort());
  assert.equal(KAKAO_OPEN_CHAT_URL, "https://open.kakao.com/o/ggmGtL5e");
  assert.deepEqual(saesomangContent.nav, [
    { label: "센터소개", href: "#about" }, { label: "방문요양·목욕", href: "#services" }, { label: "이용절차", href: "#process" },
    { label: "센터소식", href: "#stories" }, { label: "오시는길", href: "#location" }, { label: "카카오 상담 ↗", href: KAKAO_OPEN_CHAT_URL },
  ]);
  assert.deepEqual([saesomangPhotoSlots.length, saesomangContent.feature.pills.length, saesomangContent.services.cards.length, saesomangContent.process.steps.length, saesomangContent.mission.items.length, saesomangContent.care.tabs.length, saesomangContent.extras.stories.length, saesomangContent.extras.faq.length], [14, 6, 3, 6, 7, 4, 7, 3]);
  assert.ok(saesomangPhotoSlots.every(({ src }) => src.startsWith("/v3/saesomang/images/") && src.endsWith(".webp")));
  assert.equal(saesomangPhotoSlots[0].alt, "집 안에서 이동을 돕는 돌봄의 장면");
  assert.deepEqual(saesomangBrandAssets, { headerFullSvg: "/v3/saesomang/brand/header-full.svg", headerShortSvg: "/v3/saesomang/brand/header-short.svg", whySvg: "/v3/saesomang/brand/why.svg" });
  assert.deepEqual(pendingFactChecks.excludedFromVisibleContent, ["급여 범위 6항목", "버스 노선"]);
  const visible = JSON.stringify(saesomangContent);
  for (const forbidden of ["placeholder", "검토용", "급여 범위 6항목", "버스 노선", "formConfirmation"]) assert.doesNotMatch(visible, new RegExp(forbidden));
  assert.equal(saesomangContent.header.cta.label, "카카오 상담");
  assert.equal(saesomangContent.header.cta.href, KAKAO_OPEN_CHAT_URL);
  assert.equal(saesomangContent.cta.button.href, KAKAO_OPEN_CHAT_URL);
  assert.equal(saesomangContent.extras.consultation.button.href, KAKAO_OPEN_CHAT_URL);
  assert.match(saesomangContent.extras.consultation.notice, /그룹방에는 연락처·건강정보·서류 사진을 올리지 마세요/);
});

test("preserves V1 arrays and exact visible facts while separating center information", async () => {
  const [pageSource, { KAKAO_OPEN_CHAT_URL, saesomangContent }] = await Promise.all([readFile(new URL("../app/page.tsx", import.meta.url), "utf8"), loadTsModule("../content/v3/saesomang.ts")]);
  const services = extractV1Array(pageSource, "services");
  const processSteps = extractV1Array(pageSource, "processSteps");
  const posts = extractV1Array(pageSource, "posts");
  assert.deepEqual(saesomangContent.services.cards.map(({ title, description }) => [title, description]), services.map(([title, description]) => [title, description]));
  assert.deepEqual(saesomangContent.process.steps.map(({ title, description }) => [title, description]), processSteps);
  assert.deepEqual(saesomangContent.extras.stories.map(({ date, category, title, id }) => [date, category, title, id]), posts);
  assert.equal(saesomangContent.intro.body, "새소망 방문요양센터는 장기요양 1~5등급 어르신을 대상으로 요양보호사 파견, 방문요양, 방문목욕과 어르신 케어를 안내합니다. 성남·분당을 중심으로 수도권 방문 상담도 함께 살핍니다.");
  assert.ok(pageSource.includes(saesomangContent.intro.body));
  const faqSection = pageSource.match(/<section id="faq"[\s\S]*?<\/section>/)?.[0] ?? "";
  const faq = [...faqSection.matchAll(/<details><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)].map(([, question, answer]) => ({ question, answer }));
  assert.equal(faq.length, 3);
  assert.deepEqual(saesomangContent.extras.faq, faq);
  const expectedContacts = [
    { label: "TEL 031-726-5288", href: "tel:031-726-5288", kind: "center-info" },
    { label: "Mobile 010-5384-2146", href: "tel:010-5384-2146", kind: "center-info" },
    { label: "카카오 상담 ↗", href: KAKAO_OPEN_CHAT_URL, kind: "consult" },
    { label: "네이버 블로그 ↗", href: "https://blog.naver.com/wish5288", kind: "reference" },
  ];
  assert.deepEqual(saesomangContent.extras.contacts, expectedContacts);
  assert.equal(saesomangContent.footer.links, saesomangContent.extras.contacts);
  assert.equal(saesomangContent.footer.fax, "FAX 031-712-8718 · 분당·성남");
  for (const value of ["031-726-5288", "010-5384-2146", "031-712-8718"]) assert.ok(pageSource.includes(value));
  assert.deepEqual(saesomangContent.extras.location, { address: "경기도 성남시 분당구 미금로 215 청솔마을 대원상가 207호\n청솔마을대원8단지아파트상가 2층", directions: "미금역 1번 출구에서 도보 5~10분입니다.", navigationQuery: "청솔마을대원8단지아파트상가" });
  assert.equal(saesomangContent.extras.consultation.title.text, "돌봄에 관한 궁금한 점, 카카오에서 시작하세요.");
  assert.equal(saesomangContent.footer.copyright, "© 2026 새소망 방문요양센터");
});
