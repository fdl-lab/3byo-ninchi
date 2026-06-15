import type { Metadata } from "next";
import { Noto_Sans_JP, Orbitron } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "3秒認知 | Eye Memory Archive",
  description:
    "推しの視線を解析する、未来の感情記録装置。目が合った瞬間を、永遠にアーカイブする。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${orbitron.variable} h-full`}>
      <body className="min-h-full bg-[#030014] text-[#e8e0ff] antialiased">
        {children}
      </body>
    </html>
  );
}
