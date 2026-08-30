import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./portfolio-refresh.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], fallback: ["IBM Plex Sans", "Roboto", "system-ui", "sans-serif"] });

export const metadata: Metadata = {
  title: "Bryan Command Center",
  description: "A private daily operating system for focus, execution, and review.",
  applicationName: "Bryan Command Center",
  manifest: "/manifest.webmanifest?v=portfolio-2",
  appleWebApp: { capable: true, title: "Bryan Command Center", statusBarStyle: "black-translucent" },
  icons: {
    icon: [{ url: "/icons/portfolio-icon.svg?v=portfolio-2", type: "image/svg+xml" }],
    apple: [{ url: "/icons/portfolio-icon.svg?v=portfolio-2", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#070a0d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-canvas font-sans antialiased">{children}<Script src="/register-sw.js" strategy="afterInteractive" /></body>
    </html>
  );
}
