import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BandhanNova - Blogs & Insights",
  description: "Explore cutting-edge insights, tutorials, and updates from BandhanNova AI Hub. Stay ahead with the latest in AI, web development, and innovative technology.",
  keywords: ["BandhanNova", "AI", "Machine Learning", "Web Development", "Technology", "Tutorials", "Bandhan", "Blogs", "Blogs updates"],
  icons: {
    icon: "/favicon.ico",
  },
  authors: [{ name: "BandhanNova Platforms" }],
  openGraph: {
    title: "BandhanNova - Blogs & Insights",
    description: "Explore cutting-edge insights, tutorials, and updates from BandhanNova AI Hub",
    url: "https://www.bandhannova.in",
    siteName: "BandhanNova Blogs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BandhanNova - Blogs & Insights",
    description: "Explore cutting-edge insights, tutorials, and updates from BandhanNova AI Hub",
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
        {/* Ezoic Privacy Scripts - Must load first for GDPR compliance */}
        <Script
          data-cfasync="false"
          src="https://cmp.gatekeeperconsent.com/min.js"
          strategy="beforeInteractive"
        />
        <Script
          data-cfasync="false"
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          strategy="beforeInteractive"
        />

        {/* Ezoic Header Script - Initializes the ad system */}
        <Script
          async
          src="//www.ezojs.com/ezoic/sa.min.js"
          strategy="beforeInteractive"
        />

        {/* Ezoic Standalone Configuration */}
        <Script
          id="ezoic-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
            `,
          }}
        />
        {/* Highlight.js Theme */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />

        {/* Global Copy Script */}
        <Script id="copy-helper" strategy="afterInteractive">
          {`
            function copyToClipboard(btn, base64Content) {
              try {
                // Unicode-safe decoding
                const content = decodeURIComponent(Array.prototype.map.call(atob(base64Content), function(c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                navigator.clipboard.writeText(content).then(() => {
                  const copyText = btn.querySelector('.copy-text');
                  const originalText = copyText.innerText;
                  const originalIcon = btn.querySelector('svg').outerHTML;
                  
                  copyText.innerText = 'Copied!';
                  btn.querySelector('svg').outerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M20 6 9 17l-5-5"/></svg>';
                  
                  btn.classList.add('bg-emerald-500/20', 'text-emerald-500', 'border-emerald-500/20');
                  btn.classList.remove('text-white/40', 'hover:bg-primary/20');
                  
                  setTimeout(() => {
                    copyText.innerText = originalText;
                    btn.querySelector('svg').outerHTML = originalIcon;
                    btn.classList.remove('bg-emerald-500/20', 'text-emerald-500', 'border-emerald-500/20');
                    btn.classList.add('text-white/40', 'hover:bg-primary/20');
                  }, 2000);
                });
              } catch (e) {
                console.error('Copy failed:', e);
              }
            }
          `}
        </Script>
      </head>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
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


