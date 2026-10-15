import type { ContactLink, Img, V3Content } from "./types";

export const KAKAO_OPEN_CHAT_URL = "https://open.kakao.com/o/ggmGtL5e";

type SaesomangStory = {
  date: string;
  category: string;
  title: string;
  id: string;
  href: string;
};

export type SaesomangExtras = NonNullable<V3Content["extras"]> & {
  stories: SaesomangStory[];
  storyNotice: string;
  faq: NonNullable<NonNullable<V3Content["extras"]>["faq"]>;
  consultation: NonNullable<NonNullable<V3Content["extras"]>["consultation"]>;
  contacts: ContactLink[];
  location: NonNullable<V3Content["extras"]>["location"] & { navigationQuery: string };
};

export const saesomangPhotoSlots: Img[] = [
  { src: "/v3/saesomang/images/hero.webp", alt: "집 안에서 이동을 돕는 돌봄의 장면" },
  { src: "/v3/saesomang/images/intro-left.webp", alt: "편안하게 대화를 나누는 장면" },
  { src: "/v3/saesomang/images/intro-right.webp", alt: "일상 활동을 돕는 장면" },
  { src: "/v3/saesomang/images/feature.webp", alt: "집 안에서 이동을 돕는 장면" },
  { src: "/v3/saesomang/images/services.webp", alt: "일상 가까이 필요한 도움을 살피는 장면" },
  { src: "/v3/saesomang/images/card-1.webp", alt: "가정에서 일상을 돕는 방문요양 장면" },
  { src: "/v3/saesomang/images/card-2.webp", alt: "가정에서 필요한 방문목욕을 안내하는 장면" },
  { src: "/v3/saesomang/images/card-3.webp", alt: "말벗과 생활을 살피는 장면" },
  { src: "/v3/saesomang/images/mission.webp", alt: "함께 대화를 나누는 돌봄의 장면" },
  { src: "/v3/saesomang/images/care-1.webp", alt: "일상의 움직임을 돕는 장면" },
  { src: "/v3/saesomang/images/care-2.webp", alt: "생활 가까이 필요한 도움을 나누는 장면" },
  { src: "/v3/saesomang/images/care-3.webp", alt: "편안한 목욕을 안내하는 장면" },
  { src: "/v3/saesomang/images/care-4.webp", alt: "말벗이 되어 일상을 함께하는 장면" },
  { src: "/v3/saesomang/images/why.webp", alt: "편안한 일상을 함께 살피는 장면" },
];

const [hero, introLeft, introRight, feature, services, card1, card2, card3, mission, care1, care2, care3, care4, why] = saesomangPhotoSlots;

const stories: SaesomangStory[] = [
  { date: "2025. 03. 08.", category: "노인장기요양보험", title: "방문요양센터의 전문인 배상책임보험과 화재보험 가입에 대해", id: "223788443272", href: "https://blog.naver.com/wish5288/223788443272" },
  { date: "2025. 02. 13.", category: "노인장기요양보험", title: "장기요양요원의 고충 해소위한 시정 절차 등 보호수단 마련", id: "223759446035", href: "https://blog.naver.com/wish5288/223759446035" },
  { date: "2024. 11. 22.", category: "노인장기요양보험", title: "장기요양기관 법정의무교육 관리 안내", id: "223669731043", href: "https://blog.naver.com/wish5288/223669731043" },
  { date: "2024. 11. 14.", category: "노인장기요양보험", title: "장기요양기관에서의 정당한 해고 사유 및 절차", id: "223660131101", href: "https://blog.naver.com/wish5288/223660131101" },
  { date: "2022. 10. 27.", category: "센터소개", title: "분당새소망방문요양센터 성남방문요양센터 성남재가복지센터 새소망방문요양센터 입니다.", id: "222912392169", href: "https://blog.naver.com/wish5288/222912392169" },
  { date: "2022. 10. 27.", category: "오시는 길", title: "오시는 길", id: "222912387833", href: "https://blog.naver.com/wish5288/222912387833" },
  { date: "2019. 05. 23.", category: "노인장기요양보험", title: "노인장기요양보험 제도 및 신청방법 알아보기", id: "221545028279", href: "https://blog.naver.com/wish5288/221545028279" },
];

const extras: SaesomangExtras = {
  stories,
  storyNotice: "보험·교육·근로 관련 글은 센터의 가입 또는 이수 증명이 아닌, 참고를 위한 제도·운영 정보입니다.",
  faq: [
    { question: "방문요양은 어떤 도움을 받을 수 있나요?", answer: "장기요양 1~5등급 어르신을 위한 신체활동, 일상생활, 정서지원 등의 범위를 상담 과정에서 확인합니다." },
    { question: "방문목욕도 상담할 수 있나요?", answer: "네. 가정에서 필요한 방문목욕과 방문요양을 현재 상황에 맞춰 안내합니다." },
    { question: "이용 전에 무엇을 준비해야 하나요?", answer: "이용 절차와 필요한 준비는 개인 상황에 따라 다를 수 있습니다. 최신 장기요양 기준을 확인한 뒤 상담해 주세요." },
  ],
  consultation: {
    label: "카카오 오픈채팅 상담",
    title: { text: "돌봄에 관한 궁금한 점, 카카오에서 시작하세요.", emphasis: ["카카오에서"] },
    body: "새소망 방문요양센터 오픈채팅에서 이용에 관한 질문을 남겨주세요.",
    button: { label: "카카오 오픈채팅으로 상담하기", href: KAKAO_OPEN_CHAT_URL },
    notice: "카카오 오픈채팅으로 이동합니다. 그룹방에는 연락처·건강정보·서류 사진을 올리지 마세요.",
  },
  contacts: [
    { label: "TEL 031-726-5288", href: "tel:031-726-5288", kind: "center-info" },
    { label: "Mobile 010-5384-2146", href: "tel:010-5384-2146", kind: "center-info" },
    { label: "카카오 상담 ↗", href: KAKAO_OPEN_CHAT_URL, kind: "consult" },
    { label: "네이버 블로그 ↗", href: "https://blog.naver.com/wish5288", kind: "reference" },
  ],
  location: {
    address: "경기도 성남시 분당구 미금로 215 청솔마을 대원상가 207호\n청솔마을대원8단지아파트상가 2층",
    directions: "미금역 1번 출구에서 도보 5~10분입니다.",
    navigationQuery: "청솔마을대원8단지아파트상가",
  },
};

export const pendingFactChecks = {
  excludedFromVisibleContent: ["급여 범위 6항목", "버스 노선"],
  reason: "사실 확인 전에는 일반 콘텐츠에 노출하지 않습니다.",
} as const;

export const saesomangBrandAssets = {
  headerFullSvg: "/v3/saesomang/brand/header-full.svg",
  headerShortSvg: "/v3/saesomang/brand/header-short.svg",
  whySvg: "/v3/saesomang/brand/why.svg",
} as const;

export const saesomangContent: V3Content & { extras: SaesomangExtras } = {
  brand: { name: "새소망", tagline: "방문요양센터", wordmarkSvg: saesomangBrandAssets.headerFullSvg, markSvg: saesomangBrandAssets.headerShortSvg },
  nav: [
    { label: "센터소개", href: "#about" },
    { label: "방문요양·목욕", href: "#services" },
    { label: "이용절차", href: "#process" },
    { label: "센터소식", href: "#stories" },
    { label: "오시는길", href: "#location" },
    { label: "카카오 상담 ↗", href: KAKAO_OPEN_CHAT_URL },
  ],
  header: { menuLabel: "메뉴", cta: { label: "카카오 상담", href: KAKAO_OPEN_CHAT_URL } },
  frame: { sectionLabel: "새소망 방문요양센터", sectionNotice: "분당·성남 가까이에서 생활에 맞는 돌봄을 함께 살핍니다.", menuDescription: "필요한 도움과 이용 절차를 차분히 안내합니다." },
  hero: {
    title: { text: "익숙한 집에서, 오늘의 삶을 이어갑니다.", emphasis: ["오늘의 삶"] },
    titleLines: ["익숙한 집에서,", "오늘의 삶을 이어갑니다."],
    subtitle: "분당·성남 새소망 방문요양센터는 가족과 같은 마음으로 어르신과 요양보호사에게 성심성의껏 최선을 다합니다.",
    image: hero,
    sideCard: { title: { text: "장기요양 등급 신청 안내" }, icon: "leaf", popover: "인정 신청부터 이용상담까지 6단계를 함께 봅니다.", href: "#process" },
    scrollLabel: "이용 절차",
  },
  intro: {
    label: "새소망의 방식",
    headline: { text: "돌봄은 누군가의 하루를 원래의 자리로 돌려놓는 일입니다.", emphasis: ["원래의 자리"] },
    body: "새소망 방문요양센터는 장기요양 1~5등급 어르신을 대상으로 요양보호사 파견, 방문요양, 방문목욕과 어르신 케어를 안내합니다. 성남·분당을 중심으로 수도권 방문 상담도 함께 살핍니다.",
    images: [introLeft, introRight],
  },
  feature: {
    title: { text: "방문요양·방문목욕 이용 안내", emphasis: ["이용 안내"] },
    body: "장기요양 1~5등급 어르신을 위한 방문요양과 방문목욕을 안내합니다. 가족의 생활 상황과 필요한 도움을 먼저 듣고, 이용에 관한 궁금한 점을 상담에서 함께 살핍니다.",
    cta: { label: "이용 절차 보기", href: "#process" },
    cardIntro: { text: "장기요양 등급과 생활 상황에 맞춰 필요한 도움을 상담으로 정합니다.", emphasis: ["상담"] },
    pills: ["인정 신청", "방문조사", "의사소견서", "등급판정", "결과통보", "이용상담"].map((label) => ({ label, href: "#process" })),
    image: feature,
  },
  services: {
    statement: { text: "돌봄이 필요한 순간을 함께 살핍니다.", emphasis: ["함께"] },
    statementBody: "혼자 계신 시간이 길어질 때, 목욕과 이동이 힘들어지실 때, 가족의 돌봄에 도움이 필요할 때. 지금의 생활을 듣고 필요한 돌봄을 함께 살펴봅니다.",
    label: "돌봄 서비스",
    headline: { text: "필요한 도움을 생활 가까이.", emphasis: ["생활 가까이"] },
    points: ["어르신 혼자 계신 시간이 길어졌을 때", "목욕과 이동이 힘들어지셨을 때", "가족의 돌봄에 도움이 필요할 때"],
    image: services,
    cardsLabel: "돌봄 서비스",
    cards: [
      { title: "방문요양", subtitle: "일상 가까이 필요한 도움을 맞춥니다.", description: "장기요양 1~5등급 어르신 댁으로 요양보호사가 찾아가 신체활동과 일상생활을 돕습니다.", icon: "leaf", image: card1 },
      { title: "방문목욕", subtitle: "편안함과 안전을 함께 살핍니다.", description: "편안하고 안전한 일상을 위해 가정에서 필요한 방문목욕을 상담 후 안내합니다.", icon: "leaf", image: card2 },
      { title: "어르신 케어", subtitle: "가족 같은 마음으로 곁에 있습니다.", description: "말벗과 생활 살핌까지, 가족과 같은 마음으로 생활 리듬을 함께 지켜갑니다.", icon: "leaf", image: card3 },
    ],
  },
  process: {
    title: { text: "장기요양 이용, 순서부터 함께 봅니다.", emphasis: ["순서부터"] },
    note: "제도 기준과 서류는 달라질 수 있으므로 신청 전 국민건강보험공단의 최신 기준을 확인해 주세요. 준비사항은 상담에서 함께 확인합니다.",
    steps: [
      { title: "장기요양 인정 신청", description: "국민건강보험공단에 장기요양 인정 신청을 합니다." },
      { title: "방문조사", description: "공단 직원의 방문조사로 현재 필요한 도움을 확인합니다." },
      { title: "의사소견서", description: "안내받은 절차에 따라 의사소견서를 준비합니다." },
      { title: "등급판정", description: "등급판정위원회의 심의를 거쳐 결과가 결정됩니다." },
      { title: "결과통보", description: "장기요양인정서와 이용 계획 관련 결과를 받습니다." },
      { title: "이용상담", description: "새소망과 생활에 맞는 방문요양·방문목욕 이용을 상담합니다." },
    ],
  },
  mission: {
    label: "돌봄의 약속",
    title: { text: "필요한 돌봄을 생활 가까이 연결합니다.", emphasis: ["생활 가까이"] },
    items: ["신체활동 돕기", "일상생활 돕기", "말벗과 생활 살핌", "방문목욕 안내", "가족과의 소통", "생활 리듬 지키기", "제도·절차 안내"],
    image: mission,
  },
  care: {
    label: "새소망의 돌봄",
    tabs: [
      { text: "가족 같은 마음으로", image: care1 },
      { text: "장기요양 등급 기준에 맞게", image: care2 },
      { text: "분당·성남 가까이에서", image: care3 },
      { text: "편안한 일상을 함께", image: care4 },
    ],
  },
  why: {
    title: { text: "새소망이 돌봄을 함께하는 방식", emphasis: ["함께하는"] },
    body: "가족과 같은 마음으로 장기요양 1~5등급 어르신의 생활 가까이에서 필요한 도움을 함께 살핍니다.",
    footnote: "성남·분당을 중심으로 수도권 방문 상담도 함께 살핍니다.",
    image: why,
  },
  cta: {
    label: "카카오 오픈채팅 상담",
    title: { text: "돌봄에 관한 궁금한 점, 카카오에서 시작하세요.", emphasis: ["카카오에서"] },
    body: "새소망 방문요양센터 오픈채팅에서 이용에 관한 질문을 남겨주세요.",
    button: { label: "카카오 오픈채팅으로 상담하기", href: KAKAO_OPEN_CHAT_URL },
  },
  extras,
  footer: {
    copyright: "© 2026 새소망 방문요양센터",
    fax: "FAX 031-712-8718 · 분당·성남",
    links: extras.contacts,
    legal: [],
  },
};
