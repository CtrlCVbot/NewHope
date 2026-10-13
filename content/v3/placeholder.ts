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
  process: { title: { text: "차분한 시작을 함께합니다" }, note: "이용 순서의 길이와 위계를 검토합니다.", steps: [
    { title: "문의", description: "처음 떠오른 생각과 궁금한 점을 편하게 적어 봅니다. 지금의 일상에서 마음에 걸리는 순간과 바라는 방향을 천천히 꺼내 놓고, 무엇부터 살펴보면 좋을지 함께 정리합니다. 서두르지 않고 이야기를 시작할 수 있도록 필요한 말과 생각을 고르는 시간을 충분히 둡니다." },
    { title: "상담", description: "지금의 상황을 설명하는 데 필요한 말을 차분히 골라 봅니다. 익숙한 하루의 흐름과 마음속에 남은 생각을 편하게 나누며, 서로가 이해한 내용을 천천히 맞춰 갑니다. 바로 답을 정하기보다 충분히 듣고 질문을 주고받으며, 앞으로 살펴볼 방향과 순서를 부담 없이 가늠해 보는 시간입니다." },
    { title: "확인", description: "앞서 나눈 내용을 천천히 다시 살펴봅니다. 빠뜨린 점은 없는지, 지금 가장 마음에 남는 부분은 무엇인지 차분히 확인하며 다음 순서를 가늠합니다. 처음의 생각과 달라진 점이 있다면 자연스럽게 덧붙이고, 필요한 만큼 머물러도 괜찮다는 마음으로 서로의 이야기를 다시 바라봅니다." },
    { title: "계획", description: "눈앞의 우선순위를 정리하고 이어갈 방법을 그려 봅니다. 각자의 일상에 어울리는 흐름을 생각하며, 오늘 할 수 있는 일과 조금 더 시간을 두고 살필 일을 나누어 봅니다. 한 번에 모든 답을 정하지 않아도 되도록 여지를 남기고, 편안하게 이어 갈 수 있는 순서를 차분히 마련합니다." },
    { title: "연결", description: "정리한 내용을 바탕으로 필요한 대화를 이어 갑니다. 서로의 생각이 자연스럽게 닿을 수 있도록 앞서 정한 순서를 다시 살피고, 궁금한 점이나 망설이는 부분을 편하게 나눕니다. 혼자 판단해야 한다는 부담 없이 마음을 모으고, 다음에 이어 갈 이야기를 차분한 속도로 준비합니다." },
    { title: "시작", description: "준비한 흐름을 따라 첫걸음을 내딛습니다. 작은 변화와 느낌을 살피며, 필요한 때에는 편하게 돌아보고 조정할 수 있는 여백을 남겨 둡니다. 처음 정한 방향이 언제나 같을 필요는 없으므로, 각자의 리듬에 맞춰 천천히 이어 가며 다음 순간을 함께 바라봅니다." },
  ] },
  mission: { label: "마음", title: { text: "돌봄의 시간이 편안하도록" }, items: Array.from({ length: 7 }, (_, index) => `약속 ${index + 1}`), image: placeholder(9) },
  care: { label: "돌봄의 장면", tabs: ["아침", "낮", "저녁", "함께"].map((text, index) => ({ text, image: placeholder(index + 10) })) },
  why: { title: { text: "곁에 있는 이유" }, body: "한글 세리프의 읽기 흐름과 화면의 여백을 살펴봅니다.", footnote: "1차 placeholder", image: placeholder(14) },
  cta: { label: "상담", title: { text: "필요한 이야기를 들려주세요" }, body: "실제 연락처와 운영 정보는 2차 데이터 매칭에서 주입합니다.", button: { label: "문의하기", href: "#상담" } },
  footer: { copyright: "© 새소망 방문요양센터. 디자인 검토용 placeholder.", links: [], legal: [] },
};
