import React from "react";

// Base Web
import { Block } from "baseui/block";

export function Card({ children, padding }) {
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginTop: $theme.sizing.scale700,
            marginBottom: $theme.sizing.scale700,
            padding: padding ? padding : `${$theme.sizing.scale700}`,
            backgroundColor: `${$theme.colors.backgroundPrimary}`,
            overflow: "hidden",
            borderRadius: $theme.borders.radius500,
            boxShadow: "0 6px 12px -6px rgba(0, 0, 0, 0.1)",
          }),
        },
      }}
    >
      {children}
    </Block>
  );
}
