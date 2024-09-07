import React from "react";
import Image from "next/image";

interface DopaFileProps {
  file: {
    id: string;
    name: string;
    content?: string;
  };
  onOpen: () => void;
}

const DopaFile: React.FC<DopaFileProps> = ({ file, onOpen }) => {
  return (
    <div
      className="w-20 h-20 flex flex-col items-center justify-center"
      onDoubleClick={onOpen}
    >
      <Image
        src="/media/dopa-file.png"
        alt="Dopa File"
        width={48}
        height={48}
      />
      <span className="mt-2 text-xs text-center break-words w-full px-1">
        {file.name}
      </span>
    </div>
  );
};

export default DopaFile;
