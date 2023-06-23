import React from "react";

// Base Web
import { Grid, Cell } from "baseui/layout-grid";
import { Block } from "baseui/block";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { MonoParagraphSmall, MonoParagraphXSmall } from "baseui/typography";

// Icons
import { IconPlane } from "@tabler/icons-react";

export default function FlightSlice({
  origin,
  destination,
  departure,
  arrival,
  duration,
}) {
  return (
    <Grid
      gridColumns={8}
      gridMargins={2}
      overrides={{
        Grid: {
          style: ({ $theme }) => ({
            marginTop: $theme.sizing.scale700,
          }),
        },
      }}
    >
      <Cell span={2}>
        <MonoParagraphSmall
          overrides={{
            Block: {
              style: {
                marginTop: 0,
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },
          }}
        >
          {departure}
        </MonoParagraphSmall>
      </Cell>
      <Cell span={4} flexGridAlign="center">
        <Block display="flex" justifyContent="center">
          <Badge
            hierarchy={HIERARCHY.secondary}
            color={COLOR.primary}
            content="11hrs 35mins"
            overrides={{
              Badge: {
                style: ({ $theme }) => ({
                  fontSize: $theme.typography.ParagraphXSmall.fontSize,
                }),
              },
            }}
          />
        </Block>
      </Cell>
      <Cell span={2}>
        <MonoParagraphSmall
          overrides={{
            Block: {
              style: {
                marginTop: 0,
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },
          }}
        >
          {arrival}
        </MonoParagraphSmall>
      </Cell>
      <Cell span={2}>
        <MonoParagraphXSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale500,
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }),
            },
          }}
        >
          {origin}
        </MonoParagraphXSmall>
      </Cell>
      <Cell span={4} alignContent="center" justifyContent="center">
        <Block
          display="flex"
          justifyContent="right"
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: "1px",
                background: `linear-gradient(to right, transparent, ${$theme.colors.primary300}, transparent)`,
                marginBlockStart: "8px",
                marginBlockEnd: "8px",
              }),
            },
          }}
        >
          <IconPlane size={16} />
        </Block>
        <Block display="flex" justifyContent="center">
          <Badge
            hierarchy={HIERARCHY.secondary}
            color={COLOR.accent}
            content={duration}
            overrides={{
              Badge: {
                style: ({ $theme }) => ({
                  fontSize: $theme.typography.ParagraphXSmall.fontSize,
                }),
              },
            }}
          />
        </Block>
      </Cell>
      <Cell span={2}>
        <MonoParagraphXSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale500,

                marginBottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }),
            },
          }}
        >
          {destination}
        </MonoParagraphXSmall>
      </Cell>
    </Grid>
  );
}
