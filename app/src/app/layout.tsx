import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "237booking — Find your next stay",
  description:
    "Search hotels, apartments, and villas across Cameroon and beyond with 237booking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-neutral-900 text-neutral-400 text-sm py-8 mt-12">
          <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row justify-between gap-4">
            <p>© {new Date().getFullYear()} 237booking. All rights reserved.</p>
            <p>Built for travelers across Cameroon and beyond.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
