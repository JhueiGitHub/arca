import React, { useState } from "react";
import axios from "axios";
import ColorSection from "./components/ColorSection";
import FontSection from "./components/FontSection";
import IconSection from "./components/IconSection";
import WallpaperSection from "./components/WallpaperSection";

interface DesignSystem {
  id: string;
  colorTokens: Array<{ id: string; name: string; value: string }>;
  fontTokens: Array<{ id: string; name: string; value: string }>;
}

interface AppProps {
  designSystem: DesignSystem;
}

const App: React.FC<AppProps> = ({ designSystem: initialDesignSystem }) => {
  const [designSystem, setDesignSystem] =
    useState<DesignSystem>(initialDesignSystem);

  const handleUpdateDesignSystem = async (
    updatedDesignSystem: DesignSystem
  ) => {
    try {
      const response = await axios.post(
        "/api/design-system",
        updatedDesignSystem
      );
      setDesignSystem(response.data);
    } catch (error) {
      console.error("Failed to update design system:", error);
    }
  };

  return (
    <div className="absolute inset-4 flex items-start justify-center overflow-auto rounded-lg bg-black bg-opacity-80 p-8">
      <div className="w-full max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Flow Design System
        </h1>
        <div className="space-y-12">
          <ColorSection
            colorTokens={designSystem.colorTokens}
            onUpdateTokens={(colorTokens) =>
              handleUpdateDesignSystem({ ...designSystem, colorTokens })
            }
          />
          <FontSection
            fontTokens={designSystem.fontTokens}
            onUpdateTokens={(fontTokens) =>
              handleUpdateDesignSystem({ ...designSystem, fontTokens })
            }
          />
          <IconSection />
          <WallpaperSection />
        </div>
      </div>
    </div>
  );
};

export default App;
