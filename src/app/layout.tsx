// src/app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/SessionProvider";


export const metadata: Metadata = {
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'GRUTH' },
  title: {
    default: "GRUTH - Diaspora property & investment verification",
    template: "%s | GRUTH",
  },
  description:
    "Diaspora property & investment verification",
  keywords: [
    "Kenya verification",
    "diaspora projects",
    "construction verification",
    "land verification",
    "project monitoring",
  ],
  authors: [{ name: "GRUTH" }],
  creator: "GRUTH",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://groundtruth.ke",
    title: "GRUTH — Diaspora property & investment verification",
    description:
      "Trusted on-the-ground verification for diaspora-funded projects in Kenya.",
    siteName: "GRUTH",
  },
  twitter: {
    card: "summary_large_image",
    title: "GRUTH",
    description:
      "Trusted on-the-ground verification for diaspora-funded projects in Kenya.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title></title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <AuthSessionProvider>

      <body className="antialiased">{children}</body>
      </AuthSessionProvider>
    </html>
  );
}
