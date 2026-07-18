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
  applicationName: "Bryan Command Center",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Bryan Command Center",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
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
      className={inter.variable}
    >
      <body className="bg-canvas font-sans antialiased">{children}</body>
    </html>
  );
}
