import React from "react";

// Base Web
import { Block } from "baseui/block";

export default function Steps() {
  return (
    <Block
      height="75px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      overflow="hidden"
      position="relative"
      $style={{ listStyle: "none", margin: 0, padding: 0 }}
    >
      <Block
        key="origin"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              background: "black",
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
                background: "black",
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
              background: "black",
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
                background: "black",
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
