// components/finder/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  folders: Folder[];
}

interface Folder {
  id: string;
  name: string;
}

// CHANGED: Removed onFolderSelect from SidebarProps
interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return response.data;
    },
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    categoryId: string
  ) => {
    e.preventDefault();
    const folderId = e.dataTransfer.getData("text/plain");
    try {
      await axios.patch(`/api/folders/${folderId}`, { categoryId });
      queryClient.invalidateQueries(["categories"]);
    } catch (error) {
      console.error("Failed to add folder to category:", error);
    }
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="p-4">
      {categories?.map((category) => (
        <div key={category.id} className="mb-4">
          <div
            className="flex justify-between items-center p-2 bg-gray-200 cursor-pointer"
            onClick={() => toggleCategory(category.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, category.id)}
          >
            <span>{category.name}</span>
            <span>{expandedCategories.has(category.id) ? "▼" : "▶"}</span>
          </div>
          {expandedCategories.has(category.id) && (
            <div className="ml-4">
              {category.folders.map((folder) => (
                <div key={folder.id} className="p-2">
                  {folder.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
