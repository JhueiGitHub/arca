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

  return (
    <div
      ref={finderRef}
      className="relative h-full w-full overflow-hidden"
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      <motion.div
        className="absolute left-0 top-0 h-full"
        initial={{ width: 0 }}
        animate={{ width: isSidebarVisible ? 96 : 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Sidebar isVisible={isSidebarVisible} />
      </motion.div>
      <motion.div
        className="h-full"
        initial={{ marginLeft: 0 }}
        animate={{ marginLeft: isSidebarVisible ? 96 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Canvas ref={canvasRef} />
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
