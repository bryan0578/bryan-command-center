import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  fallback: ["IBM Plex Sans", "Roboto", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Bryan Command Center",
  description: "A private, ADHD-friendly daily operating system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
    >
      <body className="bg-canvas font-sans antialiased">{children}</body>
    </html>
  );
}
