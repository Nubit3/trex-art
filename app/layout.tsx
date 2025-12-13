import type { Metadata } from "next";
import { Space_Grotesk, Inter, Silkscreen } from "next/font/google"; // ADDED Silkscreen
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
// ADDED: Silkscreen Configuration
const silkscreen = Silkscreen({ 
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: '--font-silkscreen' 
});

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
      {/* ADDED: silkscreen.variable to the classList */}
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${silkscreen.variable} font-sans bg-[#050505] text-slate-200 antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        {children}
      </body>
    </html>
  );
}
