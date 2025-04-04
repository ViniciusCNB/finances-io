import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/layout/Sidebar";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased vsc-initialized bg-red-500`}
      >
        <div className="fixed top-0 left-0 bottom-0 w-56 bg-white shadow-2xl z-20 transition-transform duration-300 ease-in-out md:translate-x-0">
          <Sidebar />
        </div>
        <main className="ml-56 w-full container min-h-screen transition-all duration-300 flex items-center justify-center">
          <div className="p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
