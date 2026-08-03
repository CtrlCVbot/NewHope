import type { Metadata } from "next";
import "./globals.css";

const metadataBase = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase,
  title: "새소망 방문요양센터 | 익숙한 집에서 이어가는 오늘",
  description: "분당·성남 새소망 방문요양센터: 장기요양 1~5등급 어르신을 위한 방문요양·방문목욕 상담을 안내합니다.",
  openGraph: {
    title: "새소망 방문요양센터",
    description: "분당·성남 어르신의 익숙한 일상을 위한 방문요양·방문목욕 상담",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "새소망 방문요양센터 — 익숙한 집에서, 오늘의 삶을 이어갑니다" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "새소망 방문요양센터",
    description: "분당·성남 어르신의 익숙한 일상을 위한 방문요양·방문목욕 상담",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
