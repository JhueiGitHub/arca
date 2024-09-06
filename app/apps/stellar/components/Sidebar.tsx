// components/finder/Sidebar.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
}

interface SidebarProps {
  onCategoryClick: (categoryId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return response.data as Category[];
    },
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    categoryId: string
  ) => {
    e.preventDefault();
    setHoveredCategory(categoryId);
  };

  const handleDragLeave = () => {
    setHoveredCategory(null);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    categoryId: string
  ) => {
    e.preventDefault();
    const folderId = e.dataTransfer.getData("text/plain");
    try {
      await axios.patch(`/api/folders/${folderId}`, { categoryId });
      queryClient.invalidateQueries(["folders"]);
      queryClient.invalidateQueries(["categories"]);
    } catch (error) {
      console.error("Failed to add folder to category:", error);
    }
    setHoveredCategory(null);
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="h-full p-4 overflow-y-auto">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`mb-2 p-2 rounded cursor-pointer ${
            hoveredCategory === category.id ? "bg-blue-200" : "bg-white"
          }`}
          onClick={() => onCategoryClick(category.id)}
          onDragOver={(e) => handleDragOver(e, category.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, category.id)}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
