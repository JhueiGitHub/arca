// /root/app/apps/obsidian/components/Editor.tsx

import React from "react";
import styles from "../styles/obsidian.module.css";

interface Note {
  id: string;
  name: string;
  isFolder: false;
  parentId: string | null;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface EditorProps {
  note: Note | null;
  onUpdateNote: (updatedNote: Note) => void;
}

const Editor: React.FC<EditorProps> = ({ note, onUpdateNote }) => {
  if (!note) return <div className={styles.editor}>No note selected</div>;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateNote({
      ...note,
      content: e.target.value,
      updatedAt: Date.now(),
    });
  };

  return (
    <div className={styles.editor}>
      <input
        type="text"
        value={note.name}
        onChange={(e) =>
          onUpdateNote({ ...note, name: e.target.value, updatedAt: Date.now() })
        }
        className={`${styles.titleInput} ${styles.exemplarProFont}`}
      />
      <textarea
        value={note.content}
        onChange={handleContentChange}
        className={`${styles.contentArea} ${styles.dankFont}`}
      />
    </div>
  );
};

export default Editor;
