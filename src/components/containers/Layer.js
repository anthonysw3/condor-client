import React from "react";

// Base Web UI
import { Block } from "baseui/block";
import { LabelMedium } from "baseui/typography";
import { styled } from "baseui";

// Components
import { Panel } from "./Panel";

// Tabler Icons
import { IconX } from "@tabler/icons-react";

const LayerContainer = styled(Block, ({ $theme, $direction }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: $direction === "left" ? "flex-start" : "flex-end",
  zIndex: 999,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  cursor: "arrow",
}));

const LayerContent = styled(Block, ({ $theme }) => ({
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

export const Layer = ({
  isOpen,
  onClose,
  direction = "right",
  title,
  content,
  footer,
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <aside>
      {isOpen && (
        <LayerContainer
          onClick={handleOverlayClick}
          $direction={direction}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          <LayerContent>
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
            <Panel>{content}</Panel>
            {footer && footer}
          </LayerContent>
        </LayerContainer>
      )}
    </aside>
  );
};

export default Layer;
