import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "새소망 홈페이지 V1 · V2 비교",
  description: "새소망 방문요양센터의 현재 V1 홈페이지와 Calm Navigator V2 시안을 나란히 비교하는 로컬 화면입니다.",
};

export default function CompareLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
