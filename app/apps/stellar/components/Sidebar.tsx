import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SidebarProps {
  currentFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentFolderId,
  onFolderSelect,
}) => {
  const {
    data: folders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const response = await axios.get("/api/folders");
      return response.data;
    },
  });

  if (isLoading) return <div>Loading folders...</div>;
  if (error) return <div>Error loading folders</div>;

  const renderFolders = (parentId: string | null = null, depth = 0) => {
    return folders
      .filter((folder: any) => folder.parentId === parentId)
      .map((folder: any) => (
        <div key={folder.id} style={{ marginLeft: `${depth * 20}px` }}>
          <button
            onClick={() => onFolderSelect(folder.id)}
            className={`p-2 hover:bg-gray-200 ${
              currentFolderId === folder.id ? "bg-gray-300" : ""
            }`}
          >
            {folder.name}
          </button>
          {renderFolders(folder.id, depth + 1)}
        </div>
      ));
  };

  return (
    <div className="w-64 bg-gray-100 p-4">
      <button
        onClick={() => onFolderSelect(null)}
        className={`p-2 hover:bg-gray-200 ${
          currentFolderId === null ? "bg-gray-300" : ""
        }`}
      >
        Root
      </button>
      {renderFolders()}
    </div>
  );
};

export default Sidebar;
