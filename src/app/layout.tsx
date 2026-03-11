// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "GRUTH — Reality, confirmed before you send the money.",
    template: "%s | GRUTH",
  },
  description:
    "GroundTruth provides on-the-ground verification services for diaspora-funded projects in Kenya. Construction, land, events, and more — verified by trusted local inspectors.",
  keywords: [
    "Kenya verification",
    "diaspora projects",
    "construction verification",
    "land verification",
    "project monitoring",
  ],
  authors: [{ name: "GroundTruth" }],
  creator: "GroundTruth",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://groundtruth.ke",
    title: "GroundTruth — Reality, confirmed before you send the money.",
    description:
      "Trusted on-the-ground verification for diaspora-funded projects in Kenya.",
    siteName: "GroundTruth",
  },
  twitter: {
    card: "summary_large_image",
    title: "GroundTruth",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
