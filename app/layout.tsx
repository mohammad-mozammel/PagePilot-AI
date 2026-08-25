import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import Navbar from "@/components/Navbar"
import { Toaster } from "sonner";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap'
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap'
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ['400', '500'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: "PagePilot AI — Your voice-powered reading companion",
    template: "%s | PagePilot AI",
  },
  description: "Upload any PDF and have a real conversation with it. Ask questions, request summaries, or listen as your book is read aloud by an AI voice companion.",
  keywords: ["voice reading", "AI reading companion", "PDF to audiobook", "talk to books", "AI voice assistant", "book summaries"],
  openGraph: {
    title: "PagePilot AI — Your voice-powered reading companion",
    description: "Upload any PDF and have a real conversation with it. Ask questions, request summaries, or listen as your book is read aloud.",
    type: "website",
    siteName: "PagePilot AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "PagePilot AI — Your voice-powered reading companion",
    description: "Upload any PDF and have a real conversation with it.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#E8A33D',
          colorPrimaryForeground: '#231A07',
          colorForeground: '#221D13',
          colorBackground: '#F7F3E9',
          colorMuted: '#EFE9D9',
          colorMutedForeground: '#5C5545',
          colorInput: '#FFFEF9',
          colorNeutral: '#EFE9D9',
          borderRadius: '0.75rem',
          fontFamily: 'var(--font-inter)',
        },
      }}
    >
      <html lang="en">
        <body
          className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} relative antialiased`}
          suppressHydrationWarning
        >
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>

          <Navbar />

          {children}

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#FFFEF9',
                border: '1px solid rgba(34, 29, 19, 0.12)',
                color: '#221D13',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
