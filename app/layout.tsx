import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import "./globals.css";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrackWrestling Viewer",
  description: "An easier way to view TrackWrestling tournaments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}
      >
        <Navbar />
        <NuqsAdapter>
          <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100">
              {children}
          </main>
        </NuqsAdapter>
      </body>
    </html>
  );
}