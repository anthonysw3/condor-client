import React from "react";

// Base Web
import { Block } from "baseui/block";
import { LabelLarge } from "baseui/typography";

// Components
import DrawerBlock from "./DrawerBlock";

export default function UtilityDrawerHeader({ title }) {
  return (
    <DrawerBlock>
      <LabelLarge
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale600,
            }),
          },
        }}
      >
        {title}
      </LabelLarge>
    </DrawerBlock>
  );
}
