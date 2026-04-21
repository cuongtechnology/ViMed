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
      <body className="font-sans">{children}</body>
    </html>
  );
}
