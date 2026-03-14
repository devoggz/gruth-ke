// src/app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import PWAInstallBanner from "@/components/shared/PWAInstallBanner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "GRUTH" },
  title: {
    default: "GRUTH - Diaspora property & investment verification",
    template: "%s | GRUTH",
  },
  description: "Diaspora property & investment verification",
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
    url: "https://gruth.ke",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* PWA + mobile meta */}
        <meta name="application-name" content="GRUTH" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1e1d1a" />
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <AuthSessionProvider>
        <body className="antialiased">
          <PWAInstallBanner />
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          {children}
        </body>
      </AuthSessionProvider>
    </html>
  );
}
