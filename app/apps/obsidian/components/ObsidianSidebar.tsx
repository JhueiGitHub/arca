// /root/app/apps/obsidian/components/ObsidianSidebar.tsx

import React, { useState, useCallback } from "react";
import { File, Folder, Tree } from "@/components/magicui/file-tree";
import { Note } from "@/app/types/Note";
import { useDesignSystem } from "@/components/providers/design-system-provider";
import styles from "../styles/obsidian.module.css";
import ContextMenu from "./ContextMenu";

interface ObsidianSidebarProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onCreateFolder: (name: string, parentId: string | null) => void;
  getNoteName: (note: Note) => string;
}

const ObsidianSidebar: React.FC<ObsidianSidebarProps> = ({
  notes,
  onSelectNote,
  onCreateNote,
  onCreateFolder,
  getNoteName,
}) => {
  const { designSystem } = useDesignSystem();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    parentId: string | null;
  } | null>(null);

  const colorScheme = designSystem?.colorTokens.map((token) => token.value) || [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, parentId: string | null) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, parentId });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleCreateFolder = useCallback(() => {
    if (contextMenu) {
      const folderName = prompt("Enter folder name:");
      if (folderName) {
        onCreateFolder(folderName, contextMenu.parentId);
      }
    }
    closeContextMenu();
  }, [contextMenu, onCreateFolder, closeContextMenu]);

  const handleSelectNote = useCallback(
    (note: Note) => {
      if (!note.isFolder) {
        onSelectNote(note);
      }
    },
    [onSelectNote]
  );

  const renderItems = useCallback(
    (items: Note[], depth: number = 0) => {
      return items.map((item) => {
        const colorIndex = depth % colorScheme.length;
        const style = {
          backgroundColor: item.isFolder
            ? colorScheme[colorIndex]
            : "transparent",
          color: item.isFolder
            ? "#ffffff"
            : designSystem?.colorTokens.find((token) => token.name === "text")
                ?.value || "#000000",
          borderRadius: "4px",
          padding: "2px 4px",
          fontFamily:
            designSystem?.fontTokens.find((token) => token.name === "body")
              ?.value || "Arial",
        };

        const noteName = getNoteName(item);

        if (item.isFolder) {
          return (
            <Folder
              key={item.id}
              element={noteName}
              value={item.id}
              className={styles.customFolder}
              style={style}
              onContextMenu={(e) => handleContextMenu(e, item.id)}
            >
              {renderItems(item.children || [], depth + 1)}
            </Folder>
          );
        } else {
          return (
            <File
              key={item.id}
              value={item.id}
              className={styles.customFile}
              style={style}
              onClick={() => handleSelectNote(item)}
            >
              {noteName}
            </File>
          );
        }
      });
    },
    [
      colorScheme,
      designSystem,
      handleContextMenu,
      handleSelectNote,
      getNoteName,
    ]
  );

  return (
    <div
      className={styles.sidebar}
      onContextMenu={(e) => handleContextMenu(e, null)}
    >
      <button onClick={onCreateNote} className={styles.createNoteButton}>
        Create New Note
      </button>
      <Tree className={styles.tree} initialExpandedItems={[]}>
        {renderItems(notes)}
      </Tree>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onCreateFolder={handleCreateFolder}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default ObsidianSidebar;
