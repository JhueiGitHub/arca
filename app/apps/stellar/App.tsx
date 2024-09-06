// components/finder/Finder.tsx
import React, { useState, useRef, useCallback } from "react";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import CanvasContextMenu from "./components/CanvasCM";
import SidebarContextMenu from "./components/SidebarCM";

const Finder: React.FC = () => {
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

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = finderRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const type = x < 200 ? "sidebar" : "canvas"; // Adjust this value based on your sidebar width
      setContextMenu({ type, x, y });
    }
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const handleCreateFolder = useCallback((x: number, y: number) => {
    canvasRef.current?.handleNewFolder(x, y);
  }, []);

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

  const handleCategoryClick = useCallback((categoryId: string) => {
    // Implement category click functionality
    console.log("Category clicked:", categoryId);
  }, []);

  return (
    <div
      ref={finderRef}
      className="relative h-full w-full overflow-hidden flex"
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      <div className="w-48 h-full bg-gray-200 flex-shrink-0">
        <Sidebar onCategoryClick={handleCategoryClick} />
      </div>
      <div className="flex-grow flex flex-col">
        <div className="h-12 bg-gray-300 flex items-center px-4">
          <button
            onClick={handleNavigateBack}
            disabled={folderPath.length <= 1}
          >
            Back
          </button>
          <span className="ml-4">{folderPath.join(" / ")}</span>
        </div>
        <div className="flex-grow relative">
          <Canvas ref={canvasRef} onFolderEnter={handleFolderEnter} />
        </div>
      </div>
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
