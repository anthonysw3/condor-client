import React from "react";

// Base Web
import { Block } from "baseui/block";

export function Timeline() {
  return (
    <Block
      height="105px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      overflow="hidden"
      position="relative"
      $style={{ listStyle: "none", margin: 0, padding: 0 }}
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginTop: "17px",
            marginRight: $theme.sizing.scale500,
          }),
        },
      }}
    >
      <Block
        key="origin"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              background: $theme.colors.primary200,
              borderRadius: "100px",
              width: "15px",
              height: "15px",
              zIndex: 1,
              position: "relative",
              marginRight: $theme.sizing.scale100,
              ":after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "5px",
                background: $theme.colors.primary200,
                width: "5px",
                height: "100vh",
              },
            }),
          },
        }}
      ></Block>
      <Block
        key="origin"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              background: $theme.colors.primary200,
              borderRadius: "100px",
              width: "15px",
              height: "15px",
              zIndex: 1,
              position: "relative",
              marginRight: $theme.sizing.scale100,
              ":after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "5px",
                background: $theme.colors.primary200,
                width: "5px",
                height: "100vh",
              },
            }),
          },
        }}
      />
    </Block>
  );
}
