import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "PagePilot AI",
    template: "%s | PagePilot AI",
  },
  description: "PagePilot AI helps you read, understand, and remember more. Upload PDFs, chat with AI, generate summaries, and explore books through voice-powered conversations."
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#7A2E2C',
          colorPrimaryForeground: '#FFFDF8',
          colorForeground: '#1C1A17',
          colorBackground: '#FFFDF8',
          colorMuted: '#EDE4D3',
          colorMutedForeground: '#4A443B',
          colorInput: '#FFFDF8',
          colorInputForeground: '#1C1A17',
          colorNeutral: '#1C1A17',
          borderRadius: '0.75rem',
          fontFamily: 'var(--font-inter)',
        },
      }}
    >
      <html lang="en">
        <body
          className={`${fraunces.variable} ${inter.variable} relative antialiased`}
          suppressHydrationWarning
        >
          <Navbar />

          {children}

          <Toaster position="bottom-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}