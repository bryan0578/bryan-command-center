import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  fallback: ["IBM Plex Sans", "Manrope", "Inter", "system-ui", "sans-serif"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  fallback: ["IBM Plex Sans", "Roboto", "system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  fallback: ["Roboto Mono", "Source Code Pro", "monospace"],
});

export const metadata: Metadata = {
  title: "Command Center",
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
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-canvas font-sans antialiased">{children}</body>
    </html>
  );
}
