import type { Metadata } from "next";
import { GeistSans } from "geist/font";
import "./globals.css";
import AuthProvider from "@/app/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <body className={GeistSans.className}>
        {children}
        <Toaster /></body>
      </AuthProvider>
    </html>
  );
}
