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
  { src: "/v3/saesomang/images/hero.webp?v=wu18-20261015", alt: "집 안에서 이동을 돕는 돌봄의 장면", kind: "photo" },
  { src: "/v3/saesomang/illustrations/intro-home.svg", alt: "집에서의 일상을 상징하는 도해", kind: "diagram" },
  { src: "/v3/saesomang/illustrations/intro-conversation.svg", alt: "대화와 안내를 상징하는 도해", kind: "diagram" },
  { src: "/v3/saesomang/illustrations/feature-support.svg", alt: "필요한 도움을 함께 살피는 과정을 나타낸 도해", kind: "diagram" },
  { src: "/v3/saesomang/illustrations/services-daily.svg", alt: "일상 가까이 필요한 도움을 나타낸 도해", kind: "diagram" },
  { src: "/v3/saesomang/images/service-daily-living.webp", alt: "가정에서 식사를 준비하며 일상 도움을 나누는 가상 예시 장면", kind: "photo" },
  { src: "/v3/saesomang/images/service-bath-preparation.webp", alt: "방문목욕 전 필요한 물품을 살피는 가상 예시 장면", kind: "photo" },
  { src: "/v3/saesomang/images/service-companionship.webp", alt: "집에서 이야기를 나누며 하루를 살피는 가상 예시 장면", kind: "photo" },
  { src: "/v3/saesomang/images/mission.webp?v=wu18-20261015", alt: "서로 손을 잡은 모습", kind: "photo" },
  { src: "/v3/saesomang/images/intro-family-consultation.webp", alt: "가족이 함께 필요한 도움을 이야기하는 장면", kind: "photo" },
  { src: "/v3/saesomang/images/feature-living-conversation.webp", alt: "거실에서 일상과 필요한 도움을 이야기하는 장면", kind: "photo" },
  { src: "/v3/saesomang/illustrations/care-start.svg", alt: "문의 시작을 나타낸 도해", kind: "diagram" },
  { src: "/v3/saesomang/illustrations/care-prepare.svg", alt: "이용 준비를 나타낸 도해", kind: "diagram" },
  { src: "/v3/saesomang/illustrations/care-region.svg", alt: "지역과 일정 확인을 위한 개념도이며 실제 지도나 확정 방문 범위를 뜻하지 않습니다", kind: "diagram" },
  { src: "/v3/saesomang/illustrations/care-dialogue.svg", alt: "이용 중 소통을 나타낸 도해", kind: "diagram" },
  { src: "/v3/saesomang/illustrations/why-garden.svg", alt: "", kind: "decorative" },
];

const [hero, , , , services, card1, card2, card3, mission, introFamilyConsultation, featureLivingConversation, care1, care2, care3, care4, why] = saesomangPhotoSlots;

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
  menuSvg: "/v3/saesomang/brand/menu.svg",
  whySvg: "/v3/saesomang/brand/why.svg",
  footerSvg: "/v3/saesomang/brand/footer.svg",
  loaderSvg: "/v3/saesomang/brand/symbol-small.svg",
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
    label: "분당·성남 방문요양센터",
    headline: { text: "어떤 도움이 필요한지, 함께 이야기해요." },
    body: "익숙한 집에서의 생활을 떠올리며 필요한 도움을 살펴봅니다. 방문요양·방문목욕의 이용 방법과 준비할 내용을 차근차근 안내합니다.",
    images: [introFamilyConsultation],
    details: [{ term: "무엇이 가장 불편한가요?", description: "생활에서 도움이 필요한 순간을 함께 살펴봅니다." }, { term: "어떤 서비스를 알아보고 있나요?", description: "방문요양·방문목욕의 이용 방법을 안내합니다." }, { term: "어느 지역과 일정이 필요한가요?", description: "방문 가능 여부와 일정은 상담에서 확인합니다." }],
  },
  feature: {
    title: { text: "처음이라면, 세 가지만 생각해 보세요." },
    body: "필요한 도움, 이용 절차, 희망하는 지역과 일정을 함께 살펴봅니다. 정확히 정리하지 못했어도 괜찮습니다. 먼저 알고 싶은 부분부터 확인해 보세요.",
    cta: { label: "이용 순서 보기", href: "#process" },
    cardIntro: { text: "궁금한 내용을 선택해 주세요." },
    pills: [{ label: "이용 절차", href: "#process" }, { label: "서비스 종류", href: "#services" }, { label: "지역과 일정", href: "#location" }],
    image: featureLivingConversation,
  },
  services: {
    statement: { text: "어떤 도움이 필요하신가요?" },
    statementBody: "집 안의 생활을 살피는 일, 목욕을 준비하는 일, 누군가와 이야기하는 시간. 필요한 도움을 서비스별로 살펴보세요.",
    label: "돌봄 서비스",
    headline: { text: "하루의 생활에 필요한 돌봄." },
    points: ["어르신 혼자 계신 시간이 길어졌을 때", "목욕과 이동이 힘들어지셨을 때", "가족의 돌봄에 도움이 필요할 때"],
    image: services,
    cardsLabel: "돌봄 서비스",
    cards: [
      { title: "방문요양", subtitle: "집 안의 일상을 돕는 시간.", description: "식사 준비와 생활에서 필요한 도움을 알아봅니다. 이용 가능한 내용과 일정은 상담에서 확인해 주세요.", icon: "leaf", image: card1 },
      { title: "방문목욕", subtitle: "목욕 준비부터, 궁금한 점을 차근차근.", description: "이용 환경과 준비사항, 방문 일정에 관해 안내받을 수 있습니다. 사진은 목욕 전 준비를 표현한 예시입니다.", icon: "leaf", image: card2 },
      { title: "일상과 정서 지원", subtitle: "이야기를 나누고, 하루를 살피는 시간.", description: "말벗과 일상에서 필요한 도움을 알아보고 이용 가능 여부를 확인합니다.", icon: "leaf", image: card3 },
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
    title: { text: "돌봄을 이어가는 네 가지 약속." },
    items: ["먼저 듣기 — 어떤 도움이 필요한지 이야기를 듣습니다.", "알기 쉽게 설명하기 — 이용 절차를 차근차근 안내합니다.", "궁금한 점 살피기 — 알아보기 어려웠던 내용을 함께 확인합니다.", "변화 함께 확인하기 — 이용 과정에서 생긴 질문을 나눕니다."],
    image: mission,
  },
  care: {
    label: "상담에서 함께 확인하는 내용",
    rotation: "manual",
    tabs: [
      { text: "문의 시작", body: "궁금한 서비스 종류와 일반적인 이용 절차를 오픈채팅에서 확인합니다. 먼저 알고 싶은 내용을 편하게 문의해 주세요.", image: care1 },
      { text: "이용 준비", body: "이용 전에 확인할 사항을 정리합니다. 절차에서 궁금한 부분과 준비사항을 함께 살펴봅니다.", image: care2 },
      { text: "지역·일정 확인", body: "필요한 지역과 일정에 관한 안내를 받습니다. 실제 이용 가능 여부는 상담에서 확인합니다.", image: care3 },
      { text: "이용 중 소통", body: "이용 과정에서 생긴 질문을 나눕니다. 변경할 내용이나 추가로 궁금한 점을 확인합니다.", image: care4 },
    ],
  },
  why: {
    title: { text: "새소망을 더 알아보세요." },
    body: "안내하는 서비스와 센터 소개 글, 오시는 길을 한곳에서 확인하세요.",
    footnote: "최근 안내와 이용 가능 여부는 카카오 오픈채팅에서 확인해 주세요.",
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
