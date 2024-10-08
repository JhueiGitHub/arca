// /root/app/apps/obsidian/App.tsx

import React, { useState, useEffect } from "react";
import ObsidianSidebar from "./components/ObsidianSidebar";
import Editor from "./components/Editor";
import { useNotes } from "@/hooks/useNotes";
import styles from "./styles/obsidian.module.css";
import { Note } from "@/app/types/Note";

const App: React.FC = () => {
  const {
    notes,
    currentNote,
    setCurrentNote,
    createNote,
    updateNote,
    deleteNote,
    saveLogs,
    debugLogs,
    fetchNotes,
  } = useNotes();

  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "d") {
        setShowDebug((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSelectNote = (note: Note) => {
    console.log('Selected note:', JSON.stringify(note, null, 2));
    setCurrentNote(note);
  };

  const handleCreateNote = () => {
    createNote({ title: "New Note", content: "" });
  };

  return (
    <div className={styles.container}>
      <ObsidianSidebar 
        notes={notes}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
      />
      <div className={styles.mainContent}>
        <Editor 
          note={currentNote}
          onUpdateNote={updateNote}
        />
        {showDebug && (
          <div className={styles.debugPanel}>
            <h3 className={styles.debugTitle}>Debug Panel</h3>
            <div className={styles.debugSection}>
              <h4>Current Note:</h4>
              <pre>{JSON.stringify(currentNote, null, 2)}</pre>
            </div>
            <div className={styles.debugSection}>
              <h4>All Notes:</h4>
              <pre>{JSON.stringify(notes, null, 2)}</pre>
            </div>
            <div className={styles.debugSection}>
              <h4>Save Logs:</h4>
              <ul>
                {saveLogs.slice(-10).reverse().map((log, index) => (
                  <li key={index}>
                    {new Date(log.timestamp).toLocaleTimeString()} - {log.type}: {log.details}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.debugSection}>
              <h4>Debug Logs:</h4>
              <ul>
                {debugLogs.slice(-20).reverse().map((log, index) => (
                  <li key={index}>{log}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;