import React, { useEffect } from "react";
import { Block } from "baseui/block";
import { IconX } from "@tabler/icons-react";
import { styled } from "baseui";
import { motion, AnimatePresence } from "framer-motion";

const DrawerContainer = styled(Block, ({ $theme, $direction }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: $direction === "left" ? "flex-start" : "flex-end",
  zIndex: 999,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  cursor: "arrow",
}));

const DrawerContent = styled(Block, ({ $theme }) => ({
  backgroundColor: $theme.colors.white,
  borderRadius: $theme.borders.radius200,
  maxWidth: "499px",
  width: "100%",
  height: "100%",
  padding: 0,
  overflow: "auto",
  position: "relative",
  zIndex: 1,
}));

const CloseContainer = styled(Block, ({ $theme }) => ({
  position: "absolute",
  top: $theme.sizing.scale600,
  right: $theme.sizing.scale600,
  cursor: "pointer",
}));

const AnimatedDrawerContainer = motion(DrawerContainer);

const UtilityDrawer = ({ isOpen, onClose, direction = "right", children }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const animationControls = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? "-100%" : "100%",
    },
    visible: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 1,
      x: direction === "left" ? "-100%" : "100%",
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <AnimatedDrawerContainer
          onClick={handleOverlayClick}
          $direction={direction}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationControls}
          transition={{ duration: 0.2 }}
        >
          <DrawerContent>
            <CloseContainer onClick={onClose}>
              <IconX size={24} />
            </CloseContainer>
            {children}
          </DrawerContent>
        </AnimatedDrawerContainer>
      )}
    </AnimatePresence>
  );
};

export default UtilityDrawer;
