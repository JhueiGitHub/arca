// app/apps/obsidian/App.tsx

import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { useNotes } from "@/hooks/useNotes";
import styles from "./styles/obsidian.module.css";

interface Note {
  id: string;
  title: string;
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

  const handleSelectNote = (note: Note) => {
    setCurrentNote(note);
  };

  const handleCreateNote = () => {
    createNote("New Note", "");
  };

  return (
    <div className={styles.container}>
      <Sidebar
        notes={notes}
        currentNote={currentNote}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onDeleteNote={deleteNote}
      />
      <div className={styles.mainContent}>
        <Editor note={currentNote} onUpdateNote={updateNote} />
      </div>
    </div>
  );
};

export default App;
