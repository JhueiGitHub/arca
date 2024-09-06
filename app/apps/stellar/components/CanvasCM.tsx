// components/finder/CanvasContextMenu.tsx
import React from "react";

interface CanvasContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCreateFolder: (x: number, y: number) => void;
}

const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  x,
  y,
  onClose,
  onCreateFolder,
}) => {
  const handleCreateFolder = () => {
    onCreateFolder(x, y);
    onClose();
  };

  return (
    <div
      className="absolute bg-white shadow-md rounded-md py-2"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={handleCreateFolder}
      >
        New Folder
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={onClose}
      >
        Paste
      </button>
    </div>
  );
};

export default CanvasContextMenu;
