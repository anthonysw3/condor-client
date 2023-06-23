import React from "react";

// Base Web
import { Block } from "baseui/block";

export default function DrawerBlock({ children, ...props }) {
  return (
    <Block
      {...props}
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginTop: $theme.sizing.scale300,
            paddingLeft: "24px",
            paddingRight: "24px",
          }),
        },
      }}
    >
      {children}
    </Block>
  );
}
