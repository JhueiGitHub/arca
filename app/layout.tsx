// File: /app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NextJS OS Prototype",
  description: "A simple OS-like interface built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
