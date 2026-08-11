import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter, Merriweather, Mona_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import Navbar from "@/components/Navbar"
import { Toaster } from "sonner";

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-book",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PagePilot AI",
  description: "PagePilot AI helps you read, understand, and remember more. Upload PDFs, chat with AI, generate summaries, and explore books through voice-powered conversations."
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${ibmPlexSerif.variable} ${monaSans.variable} ${plusJakarta.variable} ${inter.variable} ${merriweather.variable} relative antialiased`}
        >
          <Navbar />

          {children}

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}