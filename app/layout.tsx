import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BandhanNova AI Hub - Blogs & Insights",
  description: "Explore cutting-edge insights, tutorials, and updates from BandhanNova AI Hub. Stay ahead with the latest in AI, web development, and innovative technology.",
  keywords: ["BandhanNova", "AI", "Machine Learning", "Web Development", "Technology", "Tutorials"],
  authors: [{ name: "BandhanNova AI Hub" }],
  openGraph: {
    title: "BandhanNova AI Hub - Blogs & Insights",
    description: "Explore cutting-edge insights, tutorials, and updates from BandhanNova AI Hub",
    url: "https://www.bandhannova.in",
    siteName: "BandhanNova AI Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BandhanNova AI Hub - Blogs & Insights",
    description: "Explore cutting-edge insights, tutorials, and updates from BandhanNova AI Hub",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5780274856983314"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

