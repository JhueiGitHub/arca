import React from "react";
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata = {
  title: "Obsidian Clone",
  description: "A simple Obsidian-like note-taking application",
};

export default function ObsidianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.variable} ${roboto_mono.variable} h-full w-full overflow-hidden`}
    >
      {children}
    </div>
  );
}
