// SidebarContextMenu.tsx
import React from "react";

interface SidebarContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

const SidebarContextMenu: React.FC<SidebarContextMenuProps> = ({
  x,
  y,
  onClose,
}) => {
  // This component is responsible for displaying the context menu
  // at the specified x and y coordinates
  return (
    <div
      className="absolute bg-white shadow-md rounded-md py-2"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={onClose}
      >
        New Category
      </button>
    </div>
  );
};

export default SidebarContextMenu;
