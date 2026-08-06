import type { Metadata } from "next";
import { IBM_Plex_Serif, Mona_Sans } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar"

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

export const metadata: Metadata = {
  title: "PagePilot AI",
  description: "PagePilot AI helps you read, understand, and remember more. Upload PDFs, chat with AI, generate summaries, and explore books through voice-powered conversations."
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en">
      <body className={`${ibmPlexSerif.variable} ${monaSans.variable} relative antialiased`}>{children}</body>
      <Navbar />
    </html>
  );
}
