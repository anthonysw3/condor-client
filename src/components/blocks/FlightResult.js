import React from "react";

// Condor
import { useCondor } from "../utils/CondorProvider";

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
import { Skeleton } from "baseui/skeleton";
import { useStyletron } from "baseui";

// Icons
import { IconPlane, IconChevronRight } from "@tabler/icons-react";

// Condor Components
import FlightDetails from "./FlightDetails";
import FlightSlice from "./FlightSlice";
import { Card } from "../primitives/card";

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

const FlightSliceBackup = ({ slice }) => {
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
};

export default function FlightResult({ offer, cheapest, fastest }) {
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

  // Convert currency code to symbol
  const currencySymbol = getCurrencySymbol(offer.total_currency);
  // Calculate the number of passengers
  const passengerCount = offer.passengers.length;
  // Calculate amount per passenger
  const amountPerPassenger = offer.total_amount / passengerCount;
  // Round up amount per passenger to the nearest whole number
  const roundedAmount = Math.ceil(amountPerPassenger);

  const { openModal, closeModal } = useCondor();

  const handleDetailsDrawer = () => {
    const title = "Flight details";
    const content = <FlightDetails offer={offer} />;
    const footer = <Footer />;

    openModal(title, content, footer);
  };

  return (
    <Card>
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginBottom: $theme.sizing.scale800,
            }),
          },
        }}
      >
        <Block display="flex" alignItems="center">
          <Block
            as="img"
            src={offer.owner.logo_symbol_url}
            alt="Image"
            width="30px"
            height="30px"
          />
          <ParagraphSmall
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  margin: 0,
                  marginLeft: $theme.sizing.scale500,
                }),
              },
            }}
          >
            {offer.owner.name}
          </ParagraphSmall>
        </Block>
        {cheapest && (
          <Badge
            content="Lowest fare"
            hierarchy={HIERARCHY.primary}
            color={COLOR.positive}
          />
        )}

        {fastest && (
          <Badge
            content="Quickest"
            hierarchy={HIERARCHY.primary}
            color={COLOR.accent}
          />
        )}
      </Block>
      {offer.slices.map((slice, index) => (
        <FlightSlice key={index} slice={slice} />
      ))}
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale700,
            }),
          },
        }}
      >
        <HeadingXSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale700,
                marginBottom: 0,
                fontWeight: "bold",
              }),
            },
          }}
        >
          {currencySymbol}
          {roundedAmount}
        </HeadingXSmall>
        <Button
          onClick={handleDetailsDrawer}
          size={SIZE.compact}
          shape={SHAPE.pill}
          endEnhancer={() => <IconChevronRight size={18} />}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale500,
                marginBottom: 0,
              }),
            },
          }}
        >
          Select
        </Button>
      </Block>
    </Card>
  );
}

export function FlightResultSkeleton() {
  return (
    <Card>
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginBottom: $theme.sizing.scale800,
            }),
          },
        }}
      >
        <Skeleton
          rows={2}
          width="200px"
          overrides={{
            Row: {
              style: {
                height: "10px",
                marginBottom: "5px",
              },
            },
          }}
          animation
        />
      </Block>
      <Skeleton
        rows={2}
        width="100%"
        overrides={{
          Row: {
            style: {
              height: "20px",
              marginBottom: "5px",
            },
          },
        }}
        animation
      />
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale700,
            }),
          },
        }}
      >
        <Skeleton
          height="40px"
          width="70px"
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale500,
                marginBottom: 0,
              }),
            },
          }}
          animation
        />
        <Skeleton
          height="40px"
          width="90px"
          animation
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale500,
                marginBottom: 0,
                borderRadius: $theme.borders.radius200,
              }),
            },
          }}
        />
      </Block>
    </Card>
  );
}

function Footer() {
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginBottom: $theme.sizing.scale700,
          }),
        },
      }}
    >
      <Button
        onClick={() => alert("Do the books")}
        endEnhancer={() => <IconChevronRight size={24} />}
        overrides={{
          BaseButton: {
            style: ({ $theme }) => ({
              width: "100%",
              margin: 0,
            }),
          },
        }}
      >
        Continue to book
      </Button>
    </Block>
  );
}
