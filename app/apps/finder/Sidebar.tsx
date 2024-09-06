import React from "react";
import { motion } from "framer-motion";
import { FileSystemItem } from "@/app/types/FileSystem";
import "@/app/globals.css";

interface SidebarProps {
  favorites: FileSystemItem[];
  onNavigate: (folderId: string) => void;
  onRemoveFromFavorites: (folderId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  favorites,
  onNavigate,
  onRemoveFromFavorites,
}) => {
  return (
    <div className="flex flex-col p-4 h-full">
      <h2 className="text-white font-semibold mb-4">Favorites</h2>
      {favorites.map((folder) => (
        <motion.div
          key={folder.id}
          className="flex items-center mb-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => onNavigate(folder.id)}
        >
          <img src="/media/folder.png" alt="Folder" className="w-6 h-6 mr-2" />
          <span className="text-gray-300 text-sm flex-grow">{folder.name}</span>
          <button
            className="ml-auto text-gray-500 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromFavorites(folder.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default Sidebar;
