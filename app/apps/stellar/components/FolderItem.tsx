import React from "react";
import Image from "next/image";

interface FolderItemProps {
  folder: {
    id: string;
    name: string;
    position: { x: number; y: number };
  };
  onOpen: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onOpen }) => {
  return (
    <div
      className="absolute cursor-move"
      style={{ left: folder.position.x, top: folder.position.y }}
      onDoubleClick={onOpen}
    >
      <div className="w-20 h-20 flex flex-col items-center justify-center">
        <Image src="/media/folder.png" alt="Folder" width={48} height={48} />
        <span className="mt-2 text-xs text-center break-words w-full px-1">
          {folder.name}
        </span>
      </div>
    </div>
  );
};

export default FolderItem;
