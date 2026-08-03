import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "새소망 방문요양센터 V2 | Calm Navigator",
  description: "새소망 방문요양센터의 Calm Navigator V2 시안입니다. 서비스, 이용 절차, 가족 안내와 센터 소식을 차분히 살펴보세요.",
};

export default function V2Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
