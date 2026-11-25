import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import "./globals.css";
import Navbar from "@/components/navbar";

const body = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OpenTW",
  description: "Wrestling tournaments, mat schedules and brackets from TrackWrestling and FloWrestling.",
};

export const viewport: Viewport = {
  themeColor: "#13294B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${body.variable} ${display.variable} antialiased min-h-full flex flex-col`}>
        <NuqsAdapter>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </NuqsAdapter>
      </body>
    </html>
  );
}
