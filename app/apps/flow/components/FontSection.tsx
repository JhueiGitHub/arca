// app/apps/flow/components/FontSection.tsx

import React, { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";

interface FontToken {
  id: string;
  name: string;
  value: string;
}

interface FontSectionProps {
  fontTokens: FontToken[];
  onUpdateTokens: (tokens: FontToken[]) => void;
}

const FontSection: React.FC<FontSectionProps> = ({
  fontTokens,
  onUpdateTokens,
}) => {
  const [localFontTokens, setLocalFontTokens] = useState(fontTokens);
  const debouncedFontTokens = useDebounce(localFontTokens, 500); // 500ms delay

  useEffect(() => {
    if (JSON.stringify(debouncedFontTokens) !== JSON.stringify(fontTokens)) {
      onUpdateTokens(debouncedFontTokens);
    }
  }, [debouncedFontTokens, onUpdateTokens, fontTokens]);

  const handleUpdateToken = (
    id: string,
    field: "name" | "value",
    newValue: string
  ) => {
    setLocalFontTokens((prev) =>
      prev.map((token) =>
        token.id === id ? { ...token, [field]: newValue } : token
      )
    );
  };

  const handleCreateToken = () => {
    const newToken = {
      id: Date.now().toString(),
      name: "New Font",
      value: "Default",
    };
    setLocalFontTokens((prev) => [...prev, newToken]);
  };

  const handleDeleteToken = (id: string) => {
    setLocalFontTokens((prev) => prev.filter((token) => token.id !== id));
  };

  return (
    <div className="rounded-lg bg-gray-900 p-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Fonts</h2>
      <button
        onClick={handleCreateToken}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Font
      </button>
      <div className="space-y-2">
        {localFontTokens.map((token) => (
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
              type="text"
              value={token.value}
              onChange={(e) =>
                handleUpdateToken(token.id, "value", e.target.value)
              }
              className="bg-gray-700 text-white px-2 py-1 rounded"
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

export default FontSection;
