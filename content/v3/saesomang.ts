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
  { date: "2026. 09. 16.", category: "센터소개", title: "따뜻한 돌봄이 필요한 순간, 새소망 방문요양센터가 함께합니다", id: "224413549928", href: "https://blog.naver.com/wish5288/224413549928" },
  { date: "2022. 10. 27.", category: "센터소개", title: "분당새소망방문요양센터 성남방문요양센터 성남재가복지센터 새소망방문요양센터 입니다.", id: "222912392169", href: "https://blog.naver.com/wish5288/222912392169" },
  { date: "2022. 10. 27.", category: "오시는 길", title: "오시는 길", id: "222912387833", href: "https://blog.naver.com/wish5288/222912387833" },
];

const extras: SaesomangExtras = {
  stories,
  storyNotice: "각 글은 표시된 작성일의 내용을 담고 있습니다. 최근 안내는 카카오 오픈채팅에서 확인해 주세요.",
  faq: [
    { question: "등급을 아직 받지 않았는데 문의할 수 있나요?", answer: "등급 신청이나 이용 방법에 관한 궁금한 점을 오픈채팅에서 문의해 주세요. 서비스 이용 조건은 별도로 확인합니다." },
    { question: "상담은 어디에서 시작하나요?", answer: "이 페이지의 상담 버튼을 누르면 새소망 카카오 오픈채팅으로 이동합니다." },
    { question: "방문요양과 방문목욕을 함께 알아볼 수 있나요?", answer: "두 서비스에 관한 문의가 가능합니다. 구체적인 이용 가능 여부와 일정은 상담에서 확인합니다." },
    { question: "문의 전에 어떤 내용을 정리하면 좋나요?", answer: "궁금한 서비스 종류와 일반적인 이용 절차 질문부터 정리해 주세요. 개인정보가 포함된 서류는 그룹방에 올리지 마세요." },
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
    title: { text: "익숙한 집에서, 편안한 하루를.", emphasis: ["편안한 하루"] },
    titleLines: ["익숙한 집에서,", "편안한 하루를."],
    subtitle: "분당·성남의 방문요양과 방문목욕을 안내합니다. 돌봄이 필요하다면 새소망 카카오 오픈채팅에서 먼저 문의해 주세요.",
    image: hero,
    sideCard: { title: { text: "장기요양 등급 신청 안내" }, icon: "leaf", popover: "인정 신청부터 이용상담까지 6단계를 함께 봅니다.", href: "#process" },
    scrollLabel: "이용 절차",
  },
  intro: {
    label: "센터소개",
    headline: { text: "새소망을 소개합니다." },
    body: "센터를 알아보는 시간부터 이용에 필요한 안내까지, 궁금한 점을 차근차근 확인해 보세요.",
    images: [introLeft, introRight],
  },
  feature: {
    title: { text: "무엇부터 알아봐야 할지 고민되시나요?", emphasis: ["무엇부터"] },
    body: "등급 신청이 처음인지, 이용할 서비스를 찾고 있는지에 따라 궁금한 점이 다를 수 있습니다.",
    cta: { label: "이용 순서 보기", href: "#process" },
    cardIntro: { text: "문의할 내용을 먼저 정리해 보세요.", emphasis: ["정리"] },
    pills: [{ label: "이용 절차", href: "#process" }, { label: "서비스 종류", href: "#services" }, { label: "지역과 일정", href: "#location" }],
    image: feature,
  },
  services: {
    statement: { text: "도움이 필요한 순간은 저마다 다릅니다." },
    statementBody: "식사를 챙기는 일, 집 안을 이동하는 일, 누군가와 이야기하는 시간. 필요한 도움을 생활 장면으로 살펴보세요.",
    label: "돌봄 서비스",
    headline: { text: "일상에 필요한 도움을 알아보세요." },
    points: ["어르신 혼자 계신 시간이 길어졌을 때", "목욕과 이동이 힘들어지셨을 때", "가족의 돌봄에 도움이 필요할 때"],
    image: services,
    cardsLabel: "돌봄 서비스",
    cards: [
      { title: "방문요양", subtitle: "가정에서 필요한 생활 도움을 안내합니다.", description: "구체적인 이용 범위와 일정은 상담에서 확인합니다.", icon: "leaf", image: card1 },
      { title: "방문목욕", subtitle: "목욕 이용에 관한 준비와 방법을 문의할 수 있습니다.", description: "이용 환경에 맞는 안내가 필요합니다.", icon: "leaf", image: card2 },
      { title: "일상과 정서 지원", subtitle: "이야기를 나누고 생활을 살피는 도움입니다.", description: "말벗과 생활 살핌에 관한 궁금한 점을 상담에서 확인합니다.", icon: "leaf", image: card3 },
    ],
  },
  process: {
    title: { text: "이용까지의 순서를 확인하세요." },
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
    title: { text: "돌봄을 연결할 때 중요하게 생각하는 것." },
    items: ["먼저 듣기", "알기 쉽게 설명하기", "궁금한 점 살피기", "변화 함께 확인하기"],
    image: mission,
  },
  care: {
    label: "상담 이후 흐름",
    tabs: [
      { text: "문의 시작", body: "궁금한 서비스 종류와 일반적인 이용 절차를 오픈채팅에서 확인합니다.", image: care1 },
      { text: "이용 준비", body: "이용 전에 확인할 사항을 정리합니다.", image: care2 },
      { text: "지역·일정 확인", body: "필요한 지역과 일정에 관한 안내를 받습니다.", image: care3 },
      { text: "이용 중 소통", body: "이용 과정에서 생긴 질문을 나눕니다.", image: care4 },
    ],
  },
  why: {
    title: { text: "직접 확인할 수 있는 새소망의 정보." },
    body: "주소, 안내하는 서비스 종류, 센터 소개 글을 이 화면에서 확인할 수 있습니다.",
    footnote: "확인된 정보는 센터 소개와 위치 안내에서 살펴보세요.",
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
