import type { Metadata } from "next";
import "../../styles/v3/tokens.css";

export const metadata: Metadata = {
  title: "V3 디자인 서체 비교 | 새소망 방문요양센터",
  description: "새소망 방문요양센터 V3 디자인의 한글 세리프 후보 비교 화면입니다.",
};

export default function V3DesignLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="v3Scope">{children}</div>;
}
