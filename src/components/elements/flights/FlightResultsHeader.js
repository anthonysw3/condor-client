import React from "react";

import { Grid, Cell } from "baseui/layout-grid";
import { HeadingXSmall, LabelSmall } from "baseui/typography";
import { Block } from "baseui/block";
import { styled } from "baseui";

const IconArrowAligned = styled(IconArrowNarrowRight, {
  marginLeft: "8px",
  marginRight: "8px",
});

const IconPassengerAligned = styled(IconUsers, {
  marginLeft: "4px",
  marginRight: "4px",
});

const IconEditAligned = styled(IconEdit, {
  marginLeft: "4px",
  marginRight: "4px",
});

// Icons
import { IconArrowNarrowRight, IconUsers, IconEdit } from "@tabler/icons-react";

export default function FlightResultsHeader() {
  return (
    <header>
      <HeadingXSmall
        overrides={{
          Block: {
            style: {
              marginTop: 0,
              marginBottom: 0,
              display: "flex",
              alignItems: "center",
            },
          },
        }}
      >
        Guangzhou <IconArrowAligned size={22} /> London
      </HeadingXSmall>
      <Block
        overrides={{
          Block: {
            style: {
              marginTop: 0,
              marginBottom: 0,
              display: "flex",
              alignItems: "center",
            },
          },
        }}
      >
        <LabelSmall
          overrides={{
            Block: {
              style: {
                marginTop: "4px",
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
              },
            },
          }}
        >
          Mon, 22 Jun &bull; <IconPassengerAligned size={12} /> 1 &bull;
          Business <IconEditAligned size={16} />
        </LabelSmall>
      </Block>
    </header>
  );
}
