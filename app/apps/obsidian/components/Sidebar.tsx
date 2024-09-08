// app/apps/obsidian/components/Sidebar.tsx

import React from "react";
import styles from "../styles/obsidian.module.css";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface SidebarProps {
  notes: Note[];
  currentNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  currentNote,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <button onClick={onCreateNote}>New Note</button>
      </div>
      <div className={styles.noteList}>
        {notes.map((note) => (
          <div
            key={note.id}
            className={`${styles.noteItem} ${
              currentNote?.id === note.id ? styles.activeNote : ""
            }`}
            onClick={() => onSelectNote(note)}
          >
            <span>{note.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
