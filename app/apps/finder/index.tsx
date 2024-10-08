// src/apps/Finder/index.tsx
"use client";

import React from "react";
import FileExplorer from "./Finder";
import { useFileSystem } from "@/hooks/useFileSystem";

const Finder: React.FC = () => {
  const {
    currentFolder,
    folderContents,
    favorites,
    navigateToFolder,
    navigateUp,
    navigateForward,
    createFolder,
    renameFolder,
    deleteFolder,
    updateFolderPosition,
    addToFavorites,
    removeFromFavorites,
    getFolderName,
    canNavigateForward,
    wipeDatabase,
    addToSidebar,
    removeFromSidebar,
    sidebarItems, // Add this line
  } = useFileSystem();

  return (
    <div className="h-full w-full">
      <FileExplorer
        currentFolder={currentFolder}
        folderContents={folderContents}
        favorites={favorites}
        onNavigate={navigateToFolder}
        onNavigateUp={navigateUp}
        onNavigateForward={navigateForward}
        onCreateFolder={createFolder}
        onRenameFolder={renameFolder}
        onDeleteFolder={deleteFolder}
        onUpdateFolderPosition={updateFolderPosition}
        onAddToFavorites={addToFavorites}
        onRemoveFromFavorites={removeFromFavorites}
        getFolderName={getFolderName}
        canNavigateForward={canNavigateForward}
        onWipeDatabase={wipeDatabase}
        onAddToSidebar={addToSidebar}
        onRemoveFromSidebar={removeFromSidebar}
        sidebarItems={sidebarItems} // Add this line
      />
    </div>
  );
};

export default Finder;
