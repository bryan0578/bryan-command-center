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
  manifest: "/manifest.webmanifest?v=portfolio-1",
  appleWebApp: { capable: true, title: "Bryan Command Center", statusBarStyle: "black-translucent" },
  icons: {
    icon: [
      { url: "/icons/icon-192.png?v=portfolio-1", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png?v=portfolio-1", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png?v=portfolio-1", sizes: "180x180", type: "image/png" }],
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
