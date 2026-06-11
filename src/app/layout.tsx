import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EnoFlow — Visual Workflow Automation Builder",
  description:
    "A lightweight, educational workflow automation builder. Drag triggers, actions, transforms, and conditions onto a canvas, then execute flows entirely in the browser.",
  keywords: [
    "workflow automation",
    "visual builder",
    "flow editor",
    "n8n alternative",
    "automation tool",
    "react flow",
    "node editor",
  ],
  openGraph: {
    title: "EnoFlow — Visual Workflow Automation Builder",
    description:
      "Build workflows visually with drag-and-drop nodes. Educational, lightweight, and runs entirely in the browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#11111b] text-white">
        {children}
      </body>
    </html>
  );
}
