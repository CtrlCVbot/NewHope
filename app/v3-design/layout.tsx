import type { Metadata } from "next";
import "../../styles/v3/tokens.css";
import "../../styles/v3/base.css";

export const metadata: Metadata = {
  title: "새소망 V3 디자인 프레임 | 방문요양센터",
  description: "새소망 방문요양센터 V3 디자인 프레임 검토 화면입니다.",
};

export default function V3DesignLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="v3Scope">{children}</div>;
}
