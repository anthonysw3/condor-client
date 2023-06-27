import React from "react";

// Base Web
import { Block } from "baseui/block";
import {
  ParagraphSmall,
  LabelSmall,
  LabelMedium,
  HeadingXSmall,
} from "baseui/typography";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { Button, SIZE, SHAPE } from "baseui/button";
import { useStyletron } from "baseui";

// Icons
import { IconPlane, IconChevronRight } from "@tabler/icons-react";

// Helper function to convert currency code to symbol
const getCurrencySymbol = (currencyCode) => {
  // Add cases for other currency codes as needed
  switch (currencyCode) {
    case "GBP":
      return "£";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return currencyCode;
  }
};

const itemStyle = {
  style: {
    width: "25%",
    flexGrow: 0,
    display: "block",
    textAlign: "center",
  },
};

const wideItemStyle = {
  style: {
    width: "50%",
    flexGrow: 0,
    display: "block",
    textAlign: "center",
  },
};

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

  function formatDuration(isoDuration) {
    const matches = isoDuration.match(/P(\d+D)?T?(\d+H)?(\d+M)?/);

    if (!matches) {
      throw new Error(`Invalid duration format: ${isoDuration}`);
    }

    let days = 0;
    let hours = 0;
    let minutes = 0;

    if (matches[1]) {
      days = parseInt(matches[1]);
    }

    if (matches[2]) {
      hours = parseInt(matches[2]);
    }

    if (matches[3]) {
      minutes = parseInt(matches[3]);
    }

    // Convert days to hours
    hours += days * 24;

    return `${hours}h ${minutes}m`;
  }

  const [css, theme] = useStyletron();

  const gradientLineStyle = {
    position: "relative",
    height: "2px",
    background: `linear-gradient(to right, transparent, ${theme.colors.primary200}, transparent)`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const planeIconStyle = {
    position: "absolute",
    top: "-7px", // Half of the icon size
    opacity: 0.25,
  };

  return (
    <FlexGrid
      flexGridColumnCount={3}
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginTop: $theme.sizing.scale600,
          }),
        },
      }}
    >
      <FlexGridItem overrides={{ Block: itemStyle }}>
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
      <FlexGridItem overrides={{ Block: wideItemStyle }}>
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
                <Block overrides={{ Block: { style: gradientLineStyle } }}>
                  <IconPlane style={planeIconStyle} size={16} />
                </Block>
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
      <FlexGridItem overrides={{ Block: itemStyle }}>
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
