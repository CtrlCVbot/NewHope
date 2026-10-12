export type Link = { label: string; href: string };

export type Img = { src: string; alt: string };

export type RichText = { text: string; emphasis?: string[] };

export type Story = { date: string; title: string; href: string };

export type Faq = { question: string; answer: string };

export type ConsultForm = { title: string; fields: { label: string; name: string; type: "text" | "tel" | "textarea" }[]; notice: string };

export type Location = { address: string; directions: string; transitNote?: string };

export type V3Content = {
  brand: { name: string; tagline: string; wordmarkSvg: string; markSvg: string };
  nav: { label: string; href: string }[];
  header: { menuLabel: string; cta: Link };
  frame: { sectionLabel: string; sectionNotice: string; menuDescription: string };
  hero: { title: RichText; subtitle: string; image: Img; sideCard: { title: RichText; icon: string; popover: string; href: string }; scrollLabel: string };
  intro: { label: string; headline: RichText; body: string; images: [Img, Img] };
  feature: { title: RichText; body: string; cta: Link; cardIntro: RichText; pills: Link[]; image: Img };
  services: { statement: RichText; statementBody: string; label: string; headline: RichText; points: string[]; image: Img; cardsLabel: string; cards: { title: string; subtitle: string; description: string; icon: string; image: Img }[] };
  process: { title: RichText; note: string; steps: { title: string; description: string }[] };
  mission: { label: string; title: RichText; items: string[]; image: Img };
  care: { label: string; tabs: { text: string; image: Img }[] };
  why: { title: RichText; body: string; footnote: string; image: Img };
  cta: { label: string; title: RichText; body: string; button: Link };
  extras?: { stories?: Story[]; faq?: Faq[]; consult?: ConsultForm; location?: Location };
  footer: { copyright: string; fax?: string; links: Link[]; legal: Link[] };
};
