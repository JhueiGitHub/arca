import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FolderItem from "./FolderItem";
import DopaFileItem from "./DopaFile";

interface CanvasProps {
  currentFolderId: string | null;
  onFolderOpen: (folderId: string) => void;
  onFileOpen: (fileId: string, fileName: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  currentFolderId,
  onFolderOpen,
  onFileOpen,
}) => {
  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["items", currentFolderId],
    queryFn: async () => {
      const [foldersResponse, filesResponse] = await Promise.all([
        axios.get(`/api/folders?parentId=${currentFolderId || "root"}`),
        axios.get(`/api/dopa-files?folderId=${currentFolderId || "root"}`),
      ]);
      return [...foldersResponse.data, ...filesResponse.data];
    },
  });

  if (isLoading) return <div className="flex-1">Loading items...</div>;
  if (error) return <div className="flex-1">Error loading items</div>;

  return (
    <div className="flex-1 relative p-4">
      {items?.map((item) =>
        item.type === "folder" ? (
          <FolderItem
            key={item.id}
            folder={item}
            onOpen={() => onFolderOpen(item.id)}
          />
        ) : (
          <DopaFileItem
            key={item.id}
            file={item}
            onOpen={() => onFileOpen(item.id, item.name)}
          />
        )
      )}
    </div>
  );
};

export default Canvas;
