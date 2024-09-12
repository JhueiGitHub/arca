// /root/app/apps/obsidian/components/ObsidianSidebar.tsx

import React from "react";
import { File, Folder, Tree } from "@/components/magicui/file-tree";
import { Note } from "@/app/types/Note";

const colorScheme = [
  "var(--light-teal)",
  "var(--deep-teal)",
  "var(--deep-blue)",
  "var(--light-blue)",
  "var(--blue-lilac)",
  "var(--deep-blue-lilac)",
  "var(--deep-pink-lilac)",
  "var(--pink-lilac)",
  "var(--rose)",
];

interface ObsidianSidebarProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
}

const ObsidianSidebar: React.FC<ObsidianSidebarProps> = ({ notes, onSelectNote, onCreateNote }) => {
  const renderItems = (items: Note[], depth: number = 0) => {
    return items.map((item) => {
      const colorIndex = depth % colorScheme.length;
      const style = {
        backgroundColor: item.isFolder
          ? colorScheme[colorIndex]
          : "transparent",
        color: item.isFolder ? "white" : "inherit",
        borderRadius: "4px",
        padding: "2px 4px",
      };

      if (item.isFolder) {
        return (
          <Folder
            key={item.id}
            element={item.name}
            value={item.id}
            className="custom-folder"
            style={style}
          >
            {renderItems(item.children, depth + 1)}
          </Folder>
        );
      } else {
        return (
          <File
            key={item.id}
            value={item.id}
            className="custom-file"
            style={style}
            onClick={() => onSelectNote(item)}
          >
            <p>{item.name}</p>
          </File>
        );
      }
    });
  };

  return (
    <div className="obsidian-sidebar h-full w-64 bg-gray-900 text-white">
      <button onClick={onCreateNote} className="w-full bg-blue-500 text-white py-2 mb-4">
        Create New Note
      </button>
      <Tree
        className="p-2 overflow-hidden rounded-md bg-gray-900"
        initialExpandedItems={[]}
      >
        {renderItems(notes)}
      </Tree>
    </div>
  );
};

export default ObsidianSidebar;