import React from "react";
import styles from "../styles/obsidian.module.css";

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.noteList}>
        {/* Note list will be populated here */}
      </div>
    </div>
  );
};

export default Sidebar;
