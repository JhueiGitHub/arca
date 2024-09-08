"use client";

import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import styles from "./styles/obsidian.module.css";

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Editor />
      </div>
    </div>
  );
};

export default App;
