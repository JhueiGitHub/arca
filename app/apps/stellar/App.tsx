"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import CanvasContextMenu from "./components/CanvasCM";
import DopaEditor from "./components/DopaEditor";
import { useUser } from "@clerk/nextjs";

const Finder: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [openFile, setOpenFile] = useState<{ id: string; name: string } | null>(
    null
  );

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get("/api/profile");
      return response.data;
    },
    enabled: !!user,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  // CHANGED: Replaced the old handleCreateItem function with a useMutation hook
  const createItemMutation = useMutation({
    mutationFn: async ({
      name,
      x,
      y,
      type,
    }: {
      name: string;
      x: number;
      y: number;
      type: string;
    }) => {
      if (!profile) throw new Error("No profile found");

      if (type === "folder") {
        return axios.post("/api/folders", {
          name,
          position: { x, y },
          profileId: profile.id,
          parentId: currentFolderId || null,
        });
      } else if (type === "dopa") {
        return axios.post("/api/dopa-files", {
          name,
          content: "",
          position: { x, y },
          profileId: profile.id,
          folderId: currentFolderId || null,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["items", currentFolderId]);
    },
  });

  // CHANGED: Updated handleCreateItem to use the mutation
  const handleCreateItem = (
    name: string,
    x: number,
    y: number,
    type: string
  ) => {
    createItemMutation.mutate({ name, x, y, type });
    closeContextMenu();
  };

  return (
    <div
      className="h-screen flex"
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      <Sidebar
        currentFolderId={currentFolderId}
        onFolderSelect={setCurrentFolderId}
      />
      <div className="flex-1 relative">
        {openFile ? (
          <DopaEditor
            fileId={openFile.id}
            fileName={openFile.name}
            onClose={() => setOpenFile(null)}
          />
        ) : (
          <Canvas
            currentFolderId={currentFolderId}
            onFolderOpen={setCurrentFolderId}
            onFileOpen={(fileId: string, fileName: string) =>
              setOpenFile({ id: fileId, name: fileName })
            }
          />
        )}
      </div>
      {contextMenu && (
        <CanvasContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onCreate={handleCreateItem}
          currentFolderId={currentFolderId}
        />
      )}
    </div>
  );
};

export default Finder;
