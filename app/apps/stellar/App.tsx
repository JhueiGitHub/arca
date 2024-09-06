// components/finder/Finder.tsx
import React, { useState, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import CanvasContextMenu from "./components/CanvasCM";
import SidebarContextMenu from "./components/SidebarCM";

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  position: { x: number; y: number };
}

const Finder: React.FC = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [navigationPath, setNavigationPath] = useState<Folder[]>([
    { id: "root", name: "Root", parentId: null, position: { x: 0, y: 0 } },
  ]);
  const [contextMenu, setContextMenu] = useState<{
    type: "canvas" | "sidebar";
    x: number;
    y: number;
  } | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const finderRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data: currentFolder } = useQuery({
    queryKey: ["folders", currentFolderId],
    queryFn: async () => {
      if (!currentFolderId) return null;
      const response = await axios.get(`/api/folders/${currentFolderId}`);
      return response.data as Folder;
    },
    enabled: !!currentFolderId,
  });

  const handleFolderOpen = useCallback(
    (folderId: string, folderName: string) => {
      setCurrentFolderId(folderId);
      setNavigationPath((prev) => [
        ...prev,
        {
          id: folderId,
          name: folderName,
          parentId: currentFolderId,
          position: { x: 0, y: 0 },
        },
      ]);
    },
    [currentFolderId]
  );

  const handleNavigateBack = useCallback(() => {
    if (navigationPath.length > 1) {
      const newPath = navigationPath.slice(0, -1);
      setNavigationPath(newPath);
      setCurrentFolderId(newPath[newPath.length - 1].id);
    }
  }, [navigationPath]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (finderRef.current) {
      const rect = finderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const type =
        sidebarRef.current &&
        e.target instanceof Node &&
        sidebarRef.current.contains(e.target)
          ? "sidebar"
          : "canvas";
      setContextMenu({ type, x, y });
    }
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const handleCreateFolder = useCallback(
    (name: string, x: number, y: number) => {
      axios
        .post("/api/folders", {
          name,
          parentId: currentFolderId || "root",
          position: { x, y },
        })
        .then((response) => {
          queryClient.invalidateQueries(["folders", currentFolderId]);
          setEditingFolderId(response.data.id);
          closeContextMenu();
        })
        .catch((error) => console.error("Failed to create folder:", error));
    },
    [currentFolderId, queryClient, closeContextMenu]
  );

  const handleCreateCategory = useCallback(
    (name: string) => {
      axios
        .post("/api/categories", { name })
        .then(() => {
          queryClient.invalidateQueries(["categories"]);
          closeContextMenu();
        })
        .catch((error) => console.error("Failed to create category:", error));
    },
    [queryClient, closeContextMenu]
  );

  const handleFolderNameUpdate = useCallback(
    (folderId: string, newName: string) => {
      axios
        .patch(`/api/folders/${folderId}`, { name: newName })
        .then(() => {
          queryClient.invalidateQueries(["folders", currentFolderId]);
          setEditingFolderId(null);
        })
        .catch((error) =>
          console.error("Failed to update folder name:", error)
        );
    },
    [currentFolderId, queryClient]
  );

  return (
    <div
      ref={finderRef}
      className="h-screen flex"
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      <div ref={sidebarRef} className="w-64 bg-gray-100 overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-10 bg-gray-200 flex items-center px-4">
          {navigationPath.map((folder, index) => (
            <React.Fragment key={folder.id}>
              {index > 0 && <span className="mx-2">/</span>}
              <button
                onClick={() => {
                  setCurrentFolderId(folder.id);
                  setNavigationPath(navigationPath.slice(0, index + 1));
                }}
                className="hover:underline"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div className="flex-1 relative">
          <Canvas
            currentFolderId={currentFolderId}
            onFolderOpen={handleFolderOpen}
            sidebarRef={sidebarRef}
            editingFolderId={editingFolderId}
            onFolderNameUpdate={handleFolderNameUpdate}
          />
        </div>
      </div>
      {contextMenu && contextMenu.type === "canvas" && (
        <CanvasContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onCreate={handleCreateFolder}
          currentFolderId={currentFolderId}
        />
      )}
      {contextMenu && contextMenu.type === "sidebar" && (
        <SidebarContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onCreate={handleCreateCategory}
        />
      )}
    </div>
  );
};

export default Finder;
