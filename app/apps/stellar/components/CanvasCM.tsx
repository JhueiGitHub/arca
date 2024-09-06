// components/finder/CanvasContextMenu.tsx
import React, { useState, useEffect, useRef } from "react";

interface CanvasContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCreate: (name: string, x: number, y: number) => void;
  currentFolderId: string | null;
}

const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  x,
  y,
  onClose,
  onCreate,
  currentFolderId,
}) => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreatingFolder && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreatingFolder]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // CHANGED: Pass x and y coordinates to onCreate
      onCreate(newFolderName, x, y);
      onClose();
    }
  };

  // ADDED: Function to handle "New Folder" click
  const handleNewFolderClick = () => {
    setIsCreatingFolder(true);
    // CHANGED: Immediately create a new folder with empty name
    onCreate("", x, y);
  };

  return (
    <div
      className="absolute bg-white shadow-md rounded-md py-2 z-50"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {!isCreatingFolder ? (
        <div
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          // CHANGED: Use handleNewFolderClick instead of setIsCreatingFolder
          onClick={handleNewFolderClick}
        >
          New Folder
        </div>
      ) : (
        <div className="px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={newFolderName}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="border-none outline-none"
            placeholder="Enter folder name"
          />
        </div>
      )}
    </div>
  );
};

export default CanvasContextMenu;
