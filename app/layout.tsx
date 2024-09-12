import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { DesignSystemProvider } from "@/components/providers/design-system-provider";
import "./globals.css";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <QueryProvider>
            <DesignSystemProvider>{children}</DesignSystemProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
