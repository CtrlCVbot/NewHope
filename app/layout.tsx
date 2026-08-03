import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const title = "새소망 방문요양 | 익숙한 집에서 이어가는 오늘";
  const description = "익숙한 집에서의 일상을 이어갈 수 있도록 곁에서 돕는 새소망 방문요양입니다.";

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title,
    description,
    openGraph: {
      title: "새소망 방문요양",
      description: "익숙한 집에서, 오늘의 삶을 이어갑니다",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "새소망 방문요양 — 익숙한 집에서, 오늘의 삶을 이어갑니다" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "새소망 방문요양",
      description: "익숙한 집에서, 오늘의 삶을 이어갑니다",
      images: ["/og.png"],
    },
  };
}

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
