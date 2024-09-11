"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

const App = dynamic(() => import("./App"), { ssr: false });

interface DesignSystem {
  id: string;
  colorTokens: Array<{ id: string; name: string; value: string }>;
  fontTokens: Array<{ id: string; name: string; value: string }>;
}

export default function FlowPage() {
  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesignSystem = async () => {
      try {
        const response = await axios.get("/api/design-system");
        setDesignSystem(response.data);
      } catch (error) {
        console.error("Failed to fetch design system:", error);
        setError("Failed to load design system. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDesignSystem();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!designSystem) {
    return <div>No design system found. Please set up your design system.</div>;
  }

  return (
    <div className="h-full w-full">
      <App designSystem={designSystem} />
    </div>
  );
}
