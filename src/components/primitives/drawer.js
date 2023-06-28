import React, { useEffect, useRef } from "react";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { LabelMedium } from "baseui/typography";
import { IconX, IconChevronRight } from "@tabler/icons-react";
import { styled } from "baseui";
import { motion, AnimatePresence } from "framer-motion";
import { ContentAnimationContainer } from "baseui/accordion/styled-components";

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
  backgroundColor: $theme.colors.primary50,
  maxWidth: "499px",
  width: "100%",
  height: "100%",
  padding: `0 ${$theme.sizing.scale700}`,
  overflow: "auto",
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
}));

const CloseContainer = styled(Block, ({ $theme }) => ({
  position: "absolute",
  top: $theme.sizing.scale600,
  right: $theme.sizing.scale600,
  cursor: "pointer",
}));

const AnimatedDrawerContainer = motion(DrawerContainer);

const UtilityDrawer = ({
  isOpen,
  onClose,
  direction = "right",
  title,
  content,
  footer,
}) => {
  const modalMountRef = useRef(null);

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
          ref={modalMountRef}
        >
          <DrawerContent>
            <CloseContainer onClick={onClose}>
              <IconX size={24} />
            </CloseContainer>
            {title && (
              <LabelMedium
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      marginTop: $theme.sizing.scale700,
                      marginLeft: $theme.sizing.scale300,
                    }),
                  },
                }}
              >
                {title}
              </LabelMedium>
            )}
            <Block
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginTop: $theme.sizing.scale700,
                    marginBottom: $theme.sizing.scale700,
                    padding: `${$theme.sizing.scale700}`,
                    backgroundColor: `${$theme.colors.backgroundPrimary}`,
                    overflow: "auto",
                    borderRadius: $theme.borders.radius500,
                    boxShadow: "0 6px 12px -6px rgba(0, 0, 0, 0.1)", // Custom shadow style
                    scrollbarWidth: "thin", // Hide the scrollbar for Firefox
                    "::-webkit-scrollbar": {
                      width: "6px", // Adjust the width of the scrollbar
                    },
                    "::-webkit-scrollbar-thumb": {
                      backgroundColor: $theme.colors.scrollbarThumb, // Set the color of the scrollbar thumb
                      borderRadius: "3px", // Adjust the border radius of the scrollbar thumb
                    },
                  }),
                },
              }}
            >
              {content}
            </Block>
            {footer && footer}
          </DrawerContent>
        </AnimatedDrawerContainer>
      )}
    </AnimatePresence>
  );
};

export default UtilityDrawer;
