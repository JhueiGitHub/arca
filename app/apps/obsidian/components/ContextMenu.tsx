// /root/app/apps/obsidian/components/ContextMenu.tsx

import React, { useEffect, useRef } from "react";
import styles from "../styles/obsidian.module.css";

interface ContextMenuProps {
  x: number;
  y: number;
  onCreateFolder: () => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onCreateFolder,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{ top: y, left: x }}
    >
      <button onClick={onCreateFolder}>Create Folder</button>
    </div>
  );
};

export default ContextMenu;
