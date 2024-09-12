// /root/app/components/providers/design-system-provider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

interface DesignSystem {
  colorTokens: Array<{ name: string; value: string }>;
  fontTokens: Array<{ name: string; value: string }>;
}

interface DesignSystemContextType {
  designSystem: DesignSystem | null;
  updateDesignSystem: (newDesignSystem: Partial<DesignSystem>) => Promise<void>;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(
  undefined
);

export const DesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(null);

  const fetchDesignSystem = useCallback(async () => {
    try {
      console.log("Fetching design system"); // Annotation: Added logging
      const response = await axios.get("/api/design-system");
      console.log("Fetched design system:", response.data); // Annotation: Added logging
      setDesignSystem(response.data);
    } catch (error) {
      console.error("Failed to fetch design system:", error);
    }
  }, []);

  useEffect(() => {
    fetchDesignSystem();
  }, [fetchDesignSystem]);

  const updateDesignSystem = async (newDesignSystem: Partial<DesignSystem>) => {
    try {
      console.log("Updating design system:", newDesignSystem); // Annotation: Added logging
      const response = await axios.patch("/api/design-system", newDesignSystem);
      console.log("Updated design system:", response.data); // Annotation: Added logging
      setDesignSystem(response.data);
    } catch (error) {
      console.error("Failed to update design system:", error);
    }
  };

  return (
    <DesignSystemContext.Provider value={{ designSystem, updateDesignSystem }}>
      {children}
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error(
      "useDesignSystem must be used within a DesignSystemProvider"
    );
  }
  return context;
};