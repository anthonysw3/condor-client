import React from "react";
import { Card } from "baseui/card";
import { HeadingMedium as BaseHeadingMedium } from "baseui/typography";
import { styled } from "baseui";

// Icons
import { IconArrowLeft } from "@tabler/icons-react";

// Styled HeadingMedium with left margin
const HeadingMedium = styled(BaseHeadingMedium, ({ $theme }) => ({
  marginLeft: $theme.sizing.scale600,
}));

export const LeftCard = ({ heading, children, ...props }) => {
  return (
    <Card
      overrides={{
        Root: {
          style: ({ $theme }) => ({
            marginTop: $theme.sizing.scale600,
            marginBottom: $theme.sizing.scale600,
          }),
        },
        Contents: {
          style: ({ $theme }) => ({
            marginLeft: 0,
          }),
        },
      }}
      {...props}
    >
      <HeadingMedium>{heading}</HeadingMedium>
      {children}
    </Card>
  );
};
