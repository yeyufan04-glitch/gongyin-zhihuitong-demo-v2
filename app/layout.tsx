import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gongyin-zhihuitong-2-1.yeyufan04.chatgpt.site"),
  title: "工银智汇通2.1｜企业国际汇款智能作业平台",
  description: "在第二版完整业务链上升级证据原件联动与多车可信运行视图的跨境汇入PoC。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "工银智汇通2.1｜企业国际汇款智能作业平台", description: "从pacs.008原始报文到风险系统协查、可信闸门、多车运行与人工接管。" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
