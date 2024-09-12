// /root/app/apps/obsidian/components/Editor.tsx

import React, { useEffect, useState } from "react";
import { useDesignSystem } from "@/components/providers/design-system-provider";
import styles from "../styles/obsidian.module.css";
import { Note } from "@/app/types/Note";

interface EditorProps {
  note: Note | null;
  onUpdateNote: (updatedNote: Partial<Note> & { id: string }) => void;
}

const Editor: React.FC<EditorProps> = ({ note, onUpdateNote }) => {
  const { designSystem } = useDesignSystem();
  const [editorStyles, setEditorStyles] = useState({
    headingFont: "Arial",
    bodyFont: "Helvetica",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
  });

  useEffect(() => {
    console.log('Current note in Editor:', note ? JSON.stringify(note, null, 2) : 'null');
  }, [note]);

  useEffect(() => {
    if (designSystem) {
      console.log("Design system updated in Editor:", designSystem); // Annotation: Added logging
      setEditorStyles({
        headingFont: designSystem.fontTokens.find((token) => token.name === "heading")?.value || "Arial",
        bodyFont: designSystem.fontTokens.find((token) => token.name === "body")?.value || "Helvetica",
        primaryColor: designSystem.colorTokens.find((token) => token.name === "primary")?.value || "#000000",
        secondaryColor: designSystem.colorTokens.find((token) => token.name === "secondary")?.value || "#ffffff",
      });
    }
  }, [designSystem]);

  const handleChange = (field: "title" | "content", value: string) => {
    if (note) {
      onUpdateNote({ id: note.id, [field]: value });
    }
  };

  if (!note) return <div className={styles.editor}>No note selected</div>;

  return (
    <div className={styles.editor}>
      <input
        type="text"
        value={note.title}
        onChange={(e) => handleChange("title", e.target.value)}
        className={styles.titleInput}
        style={{
          fontFamily: editorStyles.headingFont,
          color: editorStyles.primaryColor,
        }}
      />
      <textarea
        value={note.content}
        onChange={(e) => handleChange("content", e.target.value)}
        className={styles.contentArea}
        style={{
          fontFamily: editorStyles.bodyFont,
          color: editorStyles.secondaryColor,
        }}
      />
    </div>
  );
};

export default Editor;