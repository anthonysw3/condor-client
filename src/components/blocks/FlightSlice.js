import React from "react";

// Base Web
import { Block } from "baseui/block";
import { LabelSmall, LabelMedium } from "baseui/typography";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { useStyletron } from "baseui";

// Helpers
import { formatDuration } from "../utils/helpers/dateUtils";
import { getCurrencySymbol } from "../utils/helpers/currencyUtils";

export default function FlightSlice({ slice }) {
  // Determine outbound and arrival times
  const firstStop = slice.segments[0];
  const lastSegment = slice.segments[slice.segments.length - 1];
  const lastStop = lastSegment.stops[lastSegment.stops.length - 1];
  const outboundTime = firstStop.departing_at;
  const arrivalTime =
    slice.segments.length === 0
      ? firstStop.arriving_at
      : lastSegment.arriving_at;

  // Determine number of segments
  const numSegments = slice.segments.length;

  return (
    <FlexGrid
      flexGridColumnCount={3}
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginBottom: $theme.sizing.scale800,
          }),
        },
      }}
    >
      <FlexGridItem
        overrides={{
          Block: {
            style: {
              width: "25%",
              flexGrow: 0,
              display: "block",
              textAlign: "left",
            },
          },
        }}
      >
        <LabelMedium
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                fontWeight: "bold",
                marginTop: $theme.sizing.scale300,
              }),
            },
          }}
        >
          {outboundTime.substr(11, 5)}
        </LabelMedium>
        <LabelSmall>{slice.origin.iata_code}</LabelSmall>
      </FlexGridItem>
      <FlexGridItem
        overrides={{
          Block: {
            style: {
              width: "50%",
              flexGrow: 0,
              display: "block",
              textAlign: "center",
            },
          },
        }}
      >
        <Block>
          <Badge
            content={formatDuration(slice.duration)}
            hierarchy={HIERARCHY.secondary}
            color={COLOR.primary}
            overrides={{
              Badge: {
                style: ({ $theme }) => ({
                  fontSize: "0.6rem",
                }),
              },
            }}
          />
        </Block>
        <FlexGrid
          flexGridColumnCount={numSegments}
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale200,
              }),
            },
          }}
        >
          {Array(numSegments)
            .fill()
            .map((_, index) => (
              <FlexGridItem key={index}>
                <Block
                  overrides={{
                    Block: {
                      style: ({ $theme }) => ({
                        position: "relative",
                        height: "2px",
                        background: `linear-gradient(to right, transparent, ${$theme.colors.primary200}, transparent)`,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }),
                    },
                  }}
                ></Block>
              </FlexGridItem>
            ))}
        </FlexGrid>
        <Block>
          <Badge
            content={
              numSegments < 2
                ? "Direct"
                : `${numSegments - 1} stop${numSegments - 1 !== 1 ? "s" : ""}`
            }
            hierarchy={HIERARCHY.secondary}
            color={numSegments < 2 ? COLOR.positive : COLOR.primary}
            overrides={{
              Badge: {
                style: ({ $theme }) => ({
                  marginTop: $theme.sizing.scale200,
                  fontSize: "0.6rem",
                }),
              },
            }}
          />
        </Block>
      </FlexGridItem>
      <FlexGridItem
        overrides={{
          Block: {
            style: {
              width: "25%",
              flexGrow: 0,
              display: "block",
              textAlign: "right",
            },
          },
        }}
      >
        <LabelMedium
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                fontWeight: "bold",
                marginTop: $theme.sizing.scale300,
              }),
            },
          }}
        >
          {arrivalTime.substr(11, 5)}
        </LabelMedium>
        <LabelSmall>{slice.destination.iata_code}</LabelSmall>
      </FlexGridItem>
    </FlexGrid>
  );
}
