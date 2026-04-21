import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clinic Management System - Việt Care",
  description: "Hệ thống quản lý phòng khám/bệnh viện đa khoa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      {/* Use system font to avoid external Google Fonts fetch failures in restricted CI/dev networks */}
      <body className="font-sans">{children}</body>
    </html>
  );
}
