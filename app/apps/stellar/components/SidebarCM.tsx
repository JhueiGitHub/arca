// components/finder/SidebarContextMenu.tsx
import React, { useState, useEffect, useRef } from "react";

interface SidebarContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const SidebarContextMenu: React.FC<SidebarContextMenuProps> = ({
  x,
  y,
  onClose,
  onCreate,
}) => {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreatingCategory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreatingCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onCreate(newCategoryName);
      onClose();
    }
  };

  return (
    <div
      className="absolute bg-white shadow-md rounded-md py-2 z-50"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {!isCreatingCategory ? (
        <div
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsCreatingCategory(true)}
        >
          New Category
        </div>
      ) : (
        <div className="px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={newCategoryName}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="border-none outline-none"
            placeholder="Enter category name"
          />
        </div>
      )}
    </div>
  );
};

export default SidebarContextMenu;
