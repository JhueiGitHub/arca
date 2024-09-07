// components/finder/CanvasContextMenu.tsx
import React, { useState, useEffect, useRef } from "react";

interface CanvasContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCreate: (name: string, x: number, y: number, type: string) => void;
  currentFolderId: string | null;
}

const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  x,
  y,
  onClose,
  onCreate,
  currentFolderId,
}) => {
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [itemType, setItemType] = useState<"folder" | "dopa">("folder");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreatingItem && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreatingItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItemName(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const name = itemType === "dopa" ? `${newItemName}.dopa` : newItemName;
      onCreate(name, x, y, itemType);
      onClose();
    }
  };

  const handleNewItemClick = (type: "folder" | "dopa") => {
    setIsCreatingItem(true);
    setItemType(type);
  };

  return (
    <div
      className="absolute bg-white shadow-md rounded-md py-2 z-50"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {!isCreatingItem ? (
        <>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleNewItemClick("folder")}
          >
            New Folder
          </div>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleNewItemClick("dopa")}
          >
            New .dopa File
          </div>
        </>
      ) : (
        <div className="px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={newItemName}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="border-none outline-none"
            placeholder={`Enter ${itemType === "dopa" ? "file" : "folder"} name`}
          />
        </div>
      )}
    </div>
  );
};

export default CanvasContextMenu;
