// app/apps/flow/components/ColorSection.tsx

import React, { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";

interface ColorToken {
  id: string;
  name: string;
  value: string;
}

interface ColorSectionProps {
  colorTokens: ColorToken[];
  onUpdateTokens: (tokens: ColorToken[]) => void;
}

const ColorSection: React.FC<ColorSectionProps> = ({
  colorTokens,
  onUpdateTokens,
}) => {
  const [localColorTokens, setLocalColorTokens] = useState(colorTokens);
  const debouncedColorTokens = useDebounce(localColorTokens, 500); // 500ms delay

  useEffect(() => {
    if (JSON.stringify(debouncedColorTokens) !== JSON.stringify(colorTokens)) {
      onUpdateTokens(debouncedColorTokens);
    }
  }, [debouncedColorTokens, onUpdateTokens, colorTokens]);

  const handleUpdateToken = (
    id: string,
    field: "name" | "value",
    newValue: string
  ) => {
    setLocalColorTokens((prev) =>
      prev.map((token) =>
        token.id === id ? { ...token, [field]: newValue } : token
      )
    );
  };

  const handleCreateToken = () => {
    const newToken = {
      id: Date.now().toString(),
      name: "New Color",
      value: "#000000",
    };
    setLocalColorTokens((prev) => [...prev, newToken]);
  };

  const handleDeleteToken = (id: string) => {
    setLocalColorTokens((prev) => prev.filter((token) => token.id !== id));
  };

  return (
    <div className="rounded-lg bg-gray-900 p-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Colors</h2>
      <button
        onClick={handleCreateToken}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Color
      </button>
      <div className="space-y-2">
        {localColorTokens.map((token) => (
          <div key={token.id} className="flex items-center space-x-2">
            <input
              type="text"
              value={token.name}
              onChange={(e) =>
                handleUpdateToken(token.id, "name", e.target.value)
              }
              className="bg-gray-700 text-white px-2 py-1 rounded"
            />
            <input
              type="color"
              value={token.value}
              onChange={(e) =>
                handleUpdateToken(token.id, "value", e.target.value)
              }
              className="h-8 w-8 cursor-pointer rounded-full border-none"
            />
            <button
              onClick={() => handleDeleteToken(token.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSection;
