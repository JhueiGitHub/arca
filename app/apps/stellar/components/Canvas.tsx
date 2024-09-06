// components/finder/Canvas.tsx
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Folder } from "@prisma/client";

interface FolderWithPosition extends Folder {
  position: { x: number; y: number };
}

interface CanvasProps {}

interface CanvasRef {
  handleNewFolder: (x: number, y: number) => void;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>((props, ref) => {
  const [folders, setFolders] = useState<FolderWithPosition[]>([]);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const response = await axios.get("/api/folders");
      return response.data as FolderWithPosition[];
    },
  });

  useEffect(() => {
    if (data) {
      setFolders(data);
    }
  }, [data]);

  useEffect(() => {
    if (editingFolder && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingFolder]);

  const handleFolderMove = useCallback(
    async (id: string, newPosition: { x: number; y: number }) => {
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === id ? { ...folder, position: newPosition } : folder
        )
      );

      try {
        await axios.patch(`/api/folders/${id}`, { position: newPosition });
        queryClient.invalidateQueries(["folders"]);
      } catch (error) {
        console.error("Failed to update folder position:", error);
      }
    },
    [queryClient]
  );

  const handleFolderNameChange = useCallback(
    async (id: string, newName: string) => {
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === id ? { ...folder, name: newName } : folder
        )
      );

      try {
        await axios.patch(`/api/folders/${id}`, { name: newName });
        queryClient.invalidateQueries(["folders"]);
      } catch (error) {
        console.error("Failed to update folder name:", error);
      }
    },
    [queryClient]
  );

  const handleNewFolder = useCallback(
    async (x: number, y: number) => {
      try {
        const response = await axios.post("/api/folders", {
          name: "",
          position: { x, y },
        });
        const newFolder = response.data;
        setFolders((prevFolders) => [...prevFolders, newFolder]);
        setEditingFolder(newFolder.id);
        setNewFolderName("");
        queryClient.invalidateQueries(["folders"]);
      } catch (error) {
        console.error("Failed to create new folder:", error);
      }
    },
    [queryClient]
  );

  useImperativeHandle(ref, () => ({
    handleNewFolder,
  }));

  const handleNameInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, folderId: string) => {
      if (e.key === "Enter") {
        handleFolderNameChange(folderId, newFolderName);
        setEditingFolder(null);
      }
    },
    [handleFolderNameChange, newFolderName]
  );

  if (isLoading) return <div>Loading folders...</div>;
  if (error) return <div>Error loading folders</div>;

  return (
    <div className="h-full w-full bg-gray-100 relative">
      {folders.map((folder) => (
        <motion.div
          key={folder.id}
          className="absolute cursor-move"
          initial={{ x: folder.position.x, y: folder.position.y }}
          animate={{ x: folder.position.x, y: folder.position.y }}
          drag
          dragMomentum={false}
          onDragEnd={(event, info) => {
            handleFolderMove(folder.id, {
              x: folder.position.x + info.offset.x,
              y: folder.position.y + info.offset.y,
            });
          }}
        >
          <div className="w-20 h-20 flex flex-col items-center justify-center">
            <Image
              src="/media/folder.png"
              alt="Folder"
              width={48}
              height={48}
            />
            {editingFolder === folder.id ? (
              <input
                ref={inputRef}
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => handleNameInputKeyDown(e, folder.id)}
                onBlur={() => {
                  handleFolderNameChange(folder.id, newFolderName);
                  setEditingFolder(null);
                }}
                className="mt-2 text-xs text-center w-full px-1 bg-transparent border-none outline-none"
              />
            ) : (
              <span
                className="mt-2 text-xs text-center break-words w-full px-1"
                onDoubleClick={() => {
                  setEditingFolder(folder.id);
                  setNewFolderName(folder.name);
                }}
              >
                {folder.name}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
});

Canvas.displayName = "Canvas";

export default Canvas;
