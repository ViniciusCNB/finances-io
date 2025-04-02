import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finances.io",
  description: "Gerencie suas finanças com facilidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <div className="fixed left-0 top-16 bottom-0 w-56 bg-white shadow-sm z-20 transition-transform duration-300 ease-in-out md:translate-x-0">
          <Sidebar />
        </div>
        <main className="pl-56 pt-16 container min-h-screen min-w-screen transition-all duration-300">
          <div className="p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
