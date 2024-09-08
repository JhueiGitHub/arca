import React, { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import { UserButton } from "@clerk/nextjs";

const HiddenNavbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const springConfig = { stiffness: 300, damping: 30 };
  const navbarY = useSpring(-100, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const shouldShow = e.clientY < 50;
      setIsVisible(shouldShow);
      navbarY.set(shouldShow ? 0 : -100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [navbarY]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-16 bg-black bg-opacity-50 backdrop-blur-md z-50"
      style={{ y: navbarY }}
    >
      <div className="absolute top-4 right-4">
        <UserButton
          afterSignOutUrl="/sign-in"
          signInUrl="/sign-in"
          afterMultiSessionSingleSignOutUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: "z-50",
              avatarBox: "h-10 w-10",
              userPreviewMainIdentifier: "text-white",
              userPreviewSecondaryIdentifier: "text-gray-300",
              userPreviewTextContainer:
                "bg-black bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg p-4",
              userPreviewInfoContainer: "bg-transparent",
              userButtonPopoverCard:
                "bg-black bg-opacity-50 backdrop-filter backdrop-blur-md border border-gray-600 rounded-lg shadow-xl",
              userButtonPopoverActions: "bg-transparent",
              userButtonPopoverActionButton:
                "text-white hover:bg-white hover:bg-opacity-10",
              userButtonPopoverActionButtonText: "text-white",
              userButtonPopoverActionButtonIcon: "text-white",
              userButtonPopoverFooter:
                "bg-transparent border-t border-gray-600",
            },
          }}
        />
      </div>
    </motion.div>
  );
};

export default HiddenNavbar;
