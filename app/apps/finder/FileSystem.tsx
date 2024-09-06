// File: /components/FileSystem.tsx
import React from "react";
import FileExplorer from "./FileExplorer";
import { useFileSystem } from "@/hooks/useFileSystem";

const FileSystem: React.FC = () => {
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
  } = useFileSystem();

  return (
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
    />
  );
};

export default FileSystem;
