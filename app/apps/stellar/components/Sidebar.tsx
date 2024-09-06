// components/finder/Sidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SidebarProps {
  isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  // 1. Animation for sidebar entry
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="w-24 h-full bg-gray-100 p-2 overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={sidebarVariants}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading categories</p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="mb-2 p-2 bg-white rounded shadow"
              >
                {category.name}
              </div>
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
