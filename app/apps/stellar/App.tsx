// components/finder/Finder.tsx
import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import CanvasContextMenu from "./components/CanvasCM";
import SidebarContextMenu from "./components/SidebarCM";

const Finder: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    type: "canvas" | "sidebar";
    x: number;
    y: number;
  } | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<string[]>(["Root"]);
  const finderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<{
    handleNewFolder: (x: number, y: number) => void;
  } | null>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const rect = finderRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const type = x < 96 && isSidebarVisible ? "sidebar" : "canvas";
        setContextMenu({ type, x, y });
      }
    },
    [isSidebarVisible]
  );

  const handleMouseEnter = useCallback(() => {
    setIsSidebarVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsSidebarVisible(false);
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const handleCreateFolder = useCallback((x: number, y: number) => {
    canvasRef.current?.handleNewFolder(x, y);
  }, []);

  // Updated function to handle folder navigation
  const handleFolderEnter = useCallback(
    (folderId: string, folderName: string) => {
      setCurrentFolderId(folderId);
      setFolderPath((prevPath) => [...prevPath, folderName]);
    },
    []
  );

  const handleNavigateBack = useCallback(() => {
    if (folderPath.length > 1) {
      setFolderPath((prevPath) => prevPath.slice(0, -1));
      setCurrentFolderId((prevFolderId) => {
        // Here you would need to fetch the parent folder ID based on the current folder ID
        // For simplicity, we're just setting it to null to go back to the root
        return null;
      });
    }
  }, [folderPath]);

  return (
    <div
      ref={finderRef}
      className="relative h-full w-full overflow-hidden"
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200 flex items-center px-4">
        <button onClick={handleNavigateBack} disabled={folderPath.length <= 1}>
          Back
        </button>
        <span className="ml-4">{folderPath.join(" / ")}</span>
      </div>
      <motion.div
        className="absolute left-0 top-8 bottom-0"
        initial={{ width: 0 }}
        animate={{ width: isSidebarVisible ? 96 : 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Sidebar isVisible={isSidebarVisible} />
      </motion.div>
      <motion.div
        className="absolute top-8 bottom-0 right-0"
        initial={{ left: 0 }}
        animate={{ left: isSidebarVisible ? 96 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Canvas ref={canvasRef} onFolderEnter={handleFolderEnter} />
      </motion.div>
      {contextMenu && contextMenu.type === "canvas" && (
        <CanvasContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onCreateFolder={handleCreateFolder}
        />
      )}
      {contextMenu && contextMenu.type === "sidebar" && (
        <SidebarContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default Finder;
