import React from "react";

// Base Web
import { Block } from "baseui/block";

export const Panel = ({ children }) => {
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginTop: $theme.sizing.scale500,
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
      {children}
    </Block>
  );
};
