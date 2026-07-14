import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "轻盈计划｜8周减脂打卡",
    description: "可编辑、可拍照、可收藏的8周饮食与训练打卡工具。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: "轻盈计划", description: "8周减脂打卡：饮食、训练、记录", images: [{ url: "/og.jpg", width: 1536, height: 816 }] },
    twitter: { card: "summary_large_image", title: "轻盈计划", description: "8周减脂打卡", images: ["/og.jpg"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
