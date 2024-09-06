// components/finder/Canvas.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, PanInfo } from "framer-motion";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface Folder {
  id: string;
  name: string;
  position: { x: number; y: number };
}

interface CanvasProps {
  currentFolderId: string | null;
  onFolderOpen: (folderId: string, folderName: string) => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
  editingFolderId: string | null;
  onFolderNameUpdate: (folderId: string, newName: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  currentFolderId,
  onFolderOpen,
  sidebarRef,
  editingFolderId,
  onFolderNameUpdate,
}) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [draggingFolderId, setDraggingFolderId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  // CHANGED: Updated query to use currentFolderId
  const { data, isLoading, error } = useQuery({
    queryKey: ["folders", currentFolderId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/folders?parentId=${currentFolderId || "root"}`
      );
      return response.data as Folder[];
    },
  });

  // CHANGED: Updated useEffect to properly set folders state
  useEffect(() => {
    if (data) {
      setFolders(data);
    }
  }, [data]);

  useEffect(() => {
    if (editingFolderId) {
      const editingFolder = folders.find(
        (folder) => folder.id === editingFolderId
      );
      if (editingFolder) {
        setEditingFolderName(editingFolder.name);
      }
    }
  }, [editingFolderId, folders]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    folderId: string
  ) => {
    setDraggingFolderId(folderId);
    e.dataTransfer.setData("text/plain", folderId);
  };

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (sidebarRef.current) {
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const clientX =
        "clientX" in event
          ? event.clientX
          : (event as TouchEvent).touches[0].clientX;
      if (clientX < sidebarRect.right) {
        window.dispatchEvent(
          new CustomEvent("folderOverSidebar", {
            detail: { folderId: draggingFolderId },
          })
        );
      }
    }
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setDraggingFolderId(null);
    if (canvasRef.current && canvasRef.current.contains(event.target as Node)) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const clientX =
        "clientX" in event ? event.clientX : event.touches[0].clientX;
      const clientY =
        "clientY" in event ? event.clientY : event.touches[0].clientY;
      const newPosition = {
        x: clientX - canvasRect.left,
        y: clientY - canvasRect.top,
      };
      updateFolderPosition(draggingFolderId!, newPosition);
    }
  };

  const updateFolderPosition = async (
    folderId: string,
    position: { x: number; y: number }
  ) => {
    try {
      await axios.patch(`/api/folders/${folderId}`, { position });
      queryClient.invalidateQueries(["folders", currentFolderId]);
    } catch (error) {
      console.error("Failed to update folder position:", error);
    }
  };

  const handleFolderNameInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    folderId: string
  ) => {
    if (e.key === "Enter") {
      onFolderNameUpdate(folderId, editingFolderName);
    }
  };

  if (isLoading) return <div>Loading folders...</div>;
  if (error) return <div>Error loading folders</div>;

  // CHANGED: Added console.log to debug folders state
  console.log("Folders:", folders);

  return (
    <div ref={canvasRef} className="h-full w-full bg-gray-100 relative">
      {folders.map((folder) => (
        <motion.div
          key={folder.id}
          className="absolute cursor-move"
          initial={folder.position}
          animate={folder.position}
          drag
          dragMomentum={false}
          onDrag={(e, info) => handleDrag(e, info)}
          onDragEnd={(e, info) => handleDragEnd(e, info)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="w-20 h-20 flex flex-col items-center justify-center"
            onDoubleClick={() => onFolderOpen(folder.id, folder.name)}
          >
            <Image
              src="/media/folder.png"
              alt="Folder"
              width={48}
              height={48}
            />
            {editingFolderId === folder.id ? (
              <input
                type="text"
                value={editingFolderName}
                onChange={(e) => setEditingFolderName(e.target.value)}
                onKeyDown={(e) => handleFolderNameInputKeyDown(e, folder.id)}
                onBlur={() => onFolderNameUpdate(folder.id, editingFolderName)}
                className="mt-2 text-xs text-center w-full px-1 bg-transparent border-none outline-none"
                autoFocus
              />
            ) : (
              <span className="mt-2 text-xs text-center break-words w-full px-1">
                {folder.name}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Canvas;
