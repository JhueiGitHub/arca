import React from "react";

export const metadata = {
  title: "Obsidian Clone",
  description: "A simple Obsidian-like note-taking application",
};

export default function ObsidianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full w-full overflow-hidden">{children}</div>;
}
