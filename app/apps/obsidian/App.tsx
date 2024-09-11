// /root/app/apps/obsidian/App.tsx

import React from "react";
import ObsidianSidebar from "./components/ObsidianSidebar";
import Editor from "./components/Editor";
import { useNotes } from "@/hooks/useNotes";
import styles from "./styles/obsidian.module.css";

interface Note {
  id: string;
  name: string;
  isFolder: false;
  parentId: string | null;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const App: React.FC = () => {
  const {
    notes,
    currentNote,
    setCurrentNote,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  return (
    <div className={styles.container}>
      <ObsidianSidebar />
      <div className={styles.mainContent}>
        <Editor note={currentNote as Note | null} onUpdateNote={updateNote} />
      </div>
    </div>
  );
};

export default App;
