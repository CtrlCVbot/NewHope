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
  assert.deepEqual([saesomangPhotoSlots.length, saesomangContent.feature.pills.length, saesomangContent.services.cards.length, saesomangContent.process.steps.length, saesomangContent.mission.items.length, saesomangContent.care.tabs.length, saesomangContent.extras.stories.length, saesomangContent.extras.faq.length], [16, 3, 3, 6, 4, 4, 3, 4]);
  assert.deepEqual(saesomangPhotoSlots.map(({ src, kind }) => [src, kind]), [
    ["/v3/saesomang/images/hero-home-landscape.webp", "photo"],
    ["/v3/saesomang/illustrations/intro-home.svg", "diagram"], ["/v3/saesomang/illustrations/intro-conversation.svg", "diagram"],
    ["/v3/saesomang/illustrations/feature-support.svg", "diagram"], ["/v3/saesomang/illustrations/services-daily.svg", "diagram"],
    ["/v3/saesomang/images/service-daily-living.webp", "photo"], ["/v3/saesomang/images/service-bath-preparation.webp", "photo"], ["/v3/saesomang/images/service-companionship.webp", "photo"], ["/v3/saesomang/images/mission-listening.webp", "photo"],
    ["/v3/saesomang/images/intro-family-consultation.webp", "photo"], ["/v3/saesomang/images/feature-living-conversation.webp", "photo"],
    ["/v3/saesomang/images/care-first-question.webp", "photo"], ["/v3/saesomang/images/care-preparing-notes.webp", "photo"], ["/v3/saesomang/images/care-planning-calendar.webp", "photo"], ["/v3/saesomang/images/care-everyday-checkin.webp", "photo"], ["/v3/saesomang/images/why-evening-home.webp", "photo"],
  ]);
  assert.equal(saesomangPhotoSlots[0].alt, "집에서 어르신과 돌봄 제공자가 휴대전화를 함께 보며 이야기를 나누는 가상 장면");
  assert.deepEqual(saesomangContent.hero.mobileImage, { src: "/v3/saesomang/images/hero-home-portrait.webp", alt: "집에서 어르신과 돌봄 제공자가 휴대전화를 함께 보며 이야기를 나누는 가상 장면", kind: "photo" });
  assert.equal(saesomangContent.mission.title.text, "도움이 필요한 순간에도, 어르신의 뜻을 먼저.");
  assert.equal(saesomangContent.mission.image.alt, "어르신이 화초 이야기를 하고 옆의 사람이 귀 기울여 듣는 가상 장면");
  assert.deepEqual(saesomangContent.why, { title: { text: "익숙한 일상에, 새소망이 함께합니다." }, body: "어떤 서비스를 안내하는지, 어떻게 이용을 준비하는지 차근차근 알아보세요.", footnote: "최근 안내와 이용 가능 여부는 카카오 오픈채팅에서 확인해 주세요.", image: { src: "/v3/saesomang/images/why-evening-home.webp", alt: "해 질 무렵 집에서 함께 사진첩을 보는 가상 일상 장면", kind: "photo" } });
  assert.deepEqual(saesomangBrandAssets, { headerFullSvg: "/v3/saesomang/brand/header-full.svg", headerShortSvg: "/v3/saesomang/brand/header-short.svg", menuSvg: "/v3/saesomang/brand/menu.svg", whySvg: "/v3/saesomang/brand/why.svg", footerSvg: "/v3/saesomang/brand/footer.svg", loaderSvg: "/v3/saesomang/brand/symbol-small.svg" });
  assert.deepEqual(pendingFactChecks.excludedFromVisibleContent, ["급여 범위 6항목", "버스 노선"]);
  const visible = JSON.stringify(saesomangContent);
  for (const forbidden of ["placeholder", "검토용", "급여 범위 6항목", "버스 노선", "formConfirmation"]) assert.doesNotMatch(visible, new RegExp(forbidden));
  assert.equal(saesomangContent.header.cta.label, "카카오 상담");
  assert.equal(saesomangContent.header.cta.href, KAKAO_OPEN_CHAT_URL);
  assert.equal(saesomangContent.cta.button.href, KAKAO_OPEN_CHAT_URL);
  assert.equal(saesomangContent.care.rotation, "responsive");
  assert.equal(saesomangContent.care.title?.text, "상담에서 하나씩 함께 확인합니다.");
  assert.equal(saesomangContent.extras.consultation.button.href, KAKAO_OPEN_CHAT_URL);
  assert.match(saesomangContent.extras.consultation.notice, /그룹방에는 연락처·건강정보·서류 사진을 올리지 마세요/);
});

test("preserves source facts while applying the approved section-copy contract", async () => {
  const [pageSource, { KAKAO_OPEN_CHAT_URL, saesomangContent }] = await Promise.all([readFile(new URL("../app/page.tsx", import.meta.url), "utf8"), loadTsModule("../content/v3/saesomang.ts")]);
  const services = extractV1Array(pageSource, "services");
  const processSteps = extractV1Array(pageSource, "processSteps");
  const posts = extractV1Array(pageSource, "posts");
  assert.equal(services.length, 3);
  assert.equal(processSteps.length, 6);
  assert.equal(posts.length, 7);
  assert.deepEqual(saesomangContent.services.cards.map(({ title }) => title), ["방문요양", "방문목욕", "일상과 정서 지원"]);
  assert.deepEqual(saesomangContent.process.steps.map(({ title, description }) => [title, description]), processSteps);
  assert.deepEqual(saesomangContent.extras.stories.map(({ date, category, title, id }) => [date, category, title, id]), [
    ["2026. 09. 16.", "센터소개", "따뜻한 돌봄이 필요한 순간, 새소망 방문요양센터가 함께합니다", "224413549928"],
    ["2022. 10. 27.", "센터소개", "분당새소망방문요양센터 성남방문요양센터 성남재가복지센터 새소망방문요양센터 입니다.", "222912392169"],
    ["2022. 10. 27.", "오시는 길", "오시는 길", "222912387833"],
  ]);
  assert.deepEqual(saesomangContent.intro, {
    label: "분당·성남 방문요양센터",
    headline: { text: "어떤 도움이 필요한지, 함께 이야기해요." },
    body: "익숙한 집에서의 생활을 떠올리며 필요한 도움을 살펴봅니다. 방문요양·방문목욕의 이용 방법과 준비할 내용을 차근차근 안내합니다.",
    images: [{ src: "/v3/saesomang/images/intro-family-consultation.webp", alt: "가족이 함께 필요한 도움을 이야기하는 장면", kind: "photo" }],
    details: [
      { term: "무엇이 가장 불편한가요?", description: "생활에서 도움이 필요한 순간을 함께 살펴봅니다." },
      { term: "어떤 서비스를 알아보고 있나요?", description: "방문요양·방문목욕의 이용 방법을 안내합니다." },
      { term: "어느 지역과 일정이 필요한가요?", description: "방문 가능 여부와 일정은 상담에서 확인합니다." },
    ],
  });
  assert.deepEqual(saesomangContent.feature, {
    title: { text: "처음이라면, 세 가지만 생각해 보세요." },
    body: "필요한 도움, 이용 절차, 희망하는 지역과 일정을 함께 살펴봅니다. 정확히 정리하지 못했어도 괜찮습니다. 먼저 알고 싶은 부분부터 확인해 보세요.",
    cta: { label: "이용 순서 보기", href: "#process" },
    cardIntro: { text: "궁금한 내용을 선택해 주세요." },
    pills: [{ label: "이용 절차", href: "#process" }, { label: "서비스 종류", href: "#services" }, { label: "지역과 일정", href: "#location" }],
    image: { src: "/v3/saesomang/images/feature-living-conversation.webp", alt: "거실에서 일상과 필요한 도움을 이야기하는 장면", kind: "photo" },
  });
  const faqSection = pageSource.match(/<section id="faq"[\s\S]*?<\/section>/)?.[0] ?? "";
  const faq = [...faqSection.matchAll(/<details><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)].map(([, question, answer]) => ({ question, answer }));
  assert.equal(faq.length, 3);
  assert.equal(saesomangContent.extras.faq.length, 4);
  assert.equal(saesomangContent.extras.faq[0].question, "등급을 아직 받지 않았는데 문의할 수 있나요?");
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
  assert.deepEqual(saesomangContent.care.tabs.map(({ text, body }) => [text, body]), [
    ["문의 시작", "궁금한 서비스 종류와 일반적인 이용 절차를 오픈채팅에서 확인합니다. 먼저 알고 싶은 내용을 편하게 문의해 주세요."],
    ["이용 준비", "이용 전에 확인할 사항을 정리합니다. 절차에서 궁금한 부분과 준비사항을 함께 살펴봅니다."],
    ["지역·일정 확인", "필요한 지역과 일정에 관한 안내를 받습니다. 실제 이용 가능 여부는 상담에서 확인합니다."],
    ["이용 중 소통", "이용 과정에서 생긴 질문을 나눕니다. 변경할 내용이나 추가로 궁금한 점을 확인합니다."],
  ]);
  assert.equal(saesomangContent.footer.copyright, "© 2026 새소망 방문요양센터");
});
