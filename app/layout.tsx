import type { Metadata } from "next";
import { Bitter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bitter = Bitter({
  variable: "--font-display",
  weight: ["700", "800"],
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barbearia do Paulo",
  description: "Agende seu horário online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${bitter.variable} ${mono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}