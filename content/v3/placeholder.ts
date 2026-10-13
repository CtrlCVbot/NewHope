import type { Img, V3Content } from "./types";

const placeholder = (slot: number): Img => ({
  src: `/v3/placeholders/slot-${String(slot).padStart(2, "0")}.svg`,
  alt: `디자인 검토용 중립 이미지 자리 ${slot}`,
});

export const v3PlaceholderPhotoSlots: Img[] = Array.from({ length: 14 }, (_, index) => placeholder(index + 1));

export const v3PlaceholderContent: V3Content = {
  brand: { name: "새소망", tagline: "방문요양센터", wordmarkSvg: "/v3/placeholders/wordmark.svg", markSvg: "/v3/placeholders/mark.svg" },
  nav: ["소개", "서비스", "이용 안내", "이야기", "돌봄", "상담"].map((label) => ({ label, href: `#${label}` })),
  header: { menuLabel: "메뉴", cta: { label: "상담 시작", href: "#상담" } },
  frame: { sectionLabel: "검토용 프레임", sectionNotice: "이 영역은 다음 작업 단위에서 실제 섹션으로 교체됩니다.", menuDescription: "차분한 일상을 위한 디자인 검토용 안내입니다." },
  hero: { title: { text: "익숙한 자리에서 이어지는 오늘" }, titleLines: ["익숙한 자리에서", "이어지는 오늘"], subtitle: "익숙한 일상을 오래 지킬 수 있도록, 필요한 순간에 곁에서 마음을 듣고 차분한 돌봄의 방법을 함께 찾아갑니다.", image: placeholder(1), sideCard: { title: { text: "가까이 듣고 함께 걷습니다" }, icon: "leaf", popover: "생활의 결을 살피며 필요한 도움을 함께 찾아가는 디자인 검토용 안내입니다.", href: "#소개" }, scrollLabel: "아래로 이동" },
  intro: { label: "우리의 약속", headline: { text: "마음을 듣고 함께하며, 편안한 하루를 오래 지켜갑니다.", emphasis: ["함께하며", "오래"] }, body: "한 사람의 익숙한 생활 리듬과 가족의 마음을 함께 살피며, 필요한 순간에 부담 없이 이어지는 돌봄의 방법을 차분하게 안내합니다. 편안한 하루가 오래 이어질 수 있도록 곁에서 이야기를 듣고, 각자의 생활에 맞는 도움을 함께 찾아갑니다.", images: [placeholder(2), placeholder(3)] },
  feature: { title: { text: "필요한 순간에 귀를 기울여, 편안한 일상을 이어갑니다.", emphasis: ["필요한 순간에"] }, body: "필요한 순간에도 부담 없이 살펴볼 수 있도록, 일상의 리듬과 가족의 마음을 함께 헤아리는 돌봄의 장면을 차분하게 안내합니다. 지금의 생활에 어울리는 도움을 천천히 찾아갈 수 있도록, 편안한 대화의 자리를 준비합니다.", cta: { label: "돌봄 안내 살펴보기", href: "#서비스" }, cardIntro: { text: "일상의 작은 변화와 가족의 마음을 함께 살피며, 지금 필요한 도움을 차분히 알아볼 수 있도록 편안한 대화의 자리를 마련합니다.", emphasis: ["가족의 마음"] }, pills: ["일상의 리듬", "가족의 마음", "안전한 이동", "따뜻한 대화", "필요한 순간", "함께 찾아가는 편안한 일상의 방법을 천천히 살펴보기"].map((label) => ({ label, href: "#서비스" })), image: placeholder(4) },
  services: { statement: { text: "마음을 살피는 돌봄", emphasis: ["돌봄"] }, statementBody: "익숙한 하루의 작은 변화와 어르신의 마음을 함께 살피며, 지금 필요한 도움을 천천히 알아갑니다. 가족이 궁금해하는 순간에도 이야기를 듣고, 각자의 생활에 어울리는 돌봄의 방법을 차분하게 안내합니다. 편안한 하루가 오래 이어지도록 곁에서 함께 생각합니다.", label: "서비스", headline: { text: "오늘에 필요한 도움을 함께 찾아갑니다", emphasis: ["함께"] }, points: ["익숙한 생활의 리듬을 살피는 안내", "필요한 순간을 함께 확인하는 대화", "가족의 마음까지 헤아리는 돌봄"], image: placeholder(5), cardsLabel: "돌봄의 장면", cards: [{ title: "일상의 곁", subtitle: "생활 리듬을 살피는 안내", description: "매일의 익숙한 흐름을 천천히 살피며, 지금 필요한 도움을 함께 알아볼 수 있도록 디자인 검토용 정보를 구성합니다.", icon: "leaf", image: placeholder(6) }, { title: "마음의 안부", subtitle: "가족과 나누는 차분한 대화", description: "가족이 궁금해하는 순간과 어르신의 마음을 함께 헤아리며, 부담 없이 이어갈 수 있는 대화의 장면을 검토합니다.", icon: "leaf", image: placeholder(7) }, { title: "편안한 동행", subtitle: "필요한 순간을 함께 확인", description: "생활 속 작은 변화와 필요한 도움의 순서를 차분하게 정리하여, 편안한 일상을 이어가는 화면의 밀도를 검토합니다.", icon: "leaf", image: placeholder(8) }] },
  process: { title: { text: "차분하게 시작하는 여섯 단계" }, note: "이용 순서의 길이와 위계를 검토합니다.", steps: ["문의", "상담", "확인", "계획", "연결", "시작"].map((title) => ({ title, description: "디자인 검토용 단계 설명입니다." })) },
  mission: { label: "마음", title: { text: "돌봄의 시간이 편안하도록" }, items: Array.from({ length: 7 }, (_, index) => `약속 ${index + 1}`), image: placeholder(9) },
  care: { label: "돌봄의 장면", tabs: ["아침", "낮", "저녁", "함께"].map((text, index) => ({ text, image: placeholder(index + 10) })) },
  why: { title: { text: "곁에 있는 이유" }, body: "한글 세리프의 읽기 흐름과 화면의 여백을 살펴봅니다.", footnote: "1차 placeholder", image: placeholder(14) },
  cta: { label: "상담", title: { text: "필요한 이야기를 들려주세요" }, body: "실제 연락처와 운영 정보는 2차 데이터 매칭에서 주입합니다.", button: { label: "문의하기", href: "#상담" } },
  footer: { copyright: "© 새소망 방문요양센터. 디자인 검토용 placeholder.", links: [], legal: [] },
};
