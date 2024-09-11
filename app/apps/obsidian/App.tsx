// app/apps/obsidian/App.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { useNotes } from "@/hooks/useNotes";
import styles from "./styles/obsidian.module.css";

interface Token {
  id: string;
  name: string;
  value: string;
  parentId: string | null;
}

interface DesignSystem {
  id: string;
  colorTokens: Token[];
  fontTokens: Token[];
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

  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(null);

  useEffect(() => {
    fetchDesignSystem();
  }, []);

  const fetchDesignSystem = async () => {
    try {
      const response = await axios.get("/api/design-system");
      setDesignSystem(response.data);
    } catch (error) {
      console.error("Failed to fetch design system:", error);
    }
  };

  const getTokenValue = (
    tokenName: string,
    tokenType: "color" | "font"
  ): string => {
    if (!designSystem) return "";
    const tokens =
      tokenType === "color"
        ? designSystem.colorTokens
        : designSystem.fontTokens;
    const token = tokens.find((t) => t.name === tokenName);
    return token ? token.value : "";
  };

  const handleSelectNote = (note: any) => {
    setCurrentNote(note);
  };

  const handleCreateNote = () => {
    createNote("New Note", "");
  };

  return (
    <div className={styles.container}>
      <style jsx global>{`
        .${styles.titleInput} {
          color: ${getTokenValue("heading", "color")};
          font-family: ${getTokenValue("heading", "font")};
        }
        .${styles.contentArea} {
          color: ${getTokenValue("body", "color")};
          font-family: ${getTokenValue("body", "font")};
        }
      `}</style>
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
