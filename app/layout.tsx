import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google"; // NEW FONTS
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "REXTOON | Digital Artifacts",
  description: "Web3 Art Gallery & Gaming Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans bg-[#050505] text-slate-200 antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
