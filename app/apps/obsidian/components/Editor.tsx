import React from "react";
import styles from "../styles/obsidian.module.css";

const Editor: React.FC = () => {
  return (
    <div className={styles.editorContainer}>
      <div className={styles.editor}>
        <input
          type="text"
          placeholder="Untitled"
          className={styles.titleInput}
        />
        <div className={styles.contentArea} contentEditable={true}></div>
      </div>
    </div>
  );
};

export default Editor;
