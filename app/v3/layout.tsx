import type { Metadata } from "next";
import "../../styles/v3/tokens.css";
import "../../styles/v3/base.css";
import "../../styles/v3/saesomang-fonts.css";

export const metadata: Metadata = {
  title: "새소망 방문요양센터 · 2차 프로토타입",
  description: "분당·성남 새소망 방문요양센터의 방문요양, 방문목욕, 이용 절차와 상담 안내를 담은 검토용 프로토타입입니다.",
  openGraph: { title: "새소망 방문요양센터 · 2차 프로토타입", description: "분당·성남 새소망 방문요양센터의 방문요양, 방문목욕, 이용 절차와 상담 안내를 담은 검토용 프로토타입입니다.", images: [{ url: "/v3/saesomang/og.webp", width: 1200, height: 630, alt: "새소망 방문요양센터 2차 프로토타입" }] },
  twitter: { title: "새소망 방문요양센터 · 2차 프로토타입", description: "분당·성남 새소망 방문요양센터의 방문요양, 방문목욕, 이용 절차와 상담 안내를 담은 검토용 프로토타입입니다.", images: ["/v3/saesomang/og.webp"] },
  icons: { icon: "/v3/saesomang/brand/symbol-small.svg" },
};

export default function V3Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="v3Scope saesomangScope">{children}</div>;
}
