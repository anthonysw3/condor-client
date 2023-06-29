import React from "react";
import { useRouter } from "next/navigation";

// Condor
import { useCondor } from "../utils/CondorProvider";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Base Web
import { Block } from "baseui/block";
import {
  ParagraphSmall,
  ParagraphXSmall,
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

  const {
    origin,
    destination,
    dates: { outbound, inbound },
    travelClass,
    passengers: { adults, children, infants },
  } = useSelector((state) => state.flight);

  // Convert currency code to symbol
  const currencySymbol = getCurrencySymbol(offer.total_currency);
  // Calculate the number of passengers
  const passengerCount = offer.passengers.length;
  console.log(passengerCount);
  // Calculate amount per passenger
  const amountPerPassenger = offer.total_amount / passengerCount;
  console.log(amountPerPassenger);
  // Round up amount per passenger to the nearest whole number
  const roundedAmount = Math.ceil(amountPerPassenger);

  const formatPriceWithCommas = (price) => {
    return price.toLocaleString(); // Adds commas to the price
  };

  const { openModal, closeModal } = useCondor();

  const handleDetailsDrawer = () => {
    const title = `Flight to ${destination.name}`;
    const content = <FlightDetails offer={offer} />;
    const footer = <Footer />;

    openModal(title, content, footer);
  };

  return (
    <Card>
      {/*<Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginBottom: 0,
            }),
          },
        }}
      >
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
        </Block> */}
      {offer.slices.map((slice, index) => (
        <FlightSlice key={index} slice={slice} />
      ))}
      <Block display="flex" alignItems="center">
        <Block
          as="img"
          src={offer.owner.logo_symbol_url}
          alt="Image"
          width="22px"
          height="22px"
        />
        <ParagraphXSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                margin: 0,
                marginLeft: $theme.sizing.scale300,
              }),
            },
          }}
        >
          {offer.owner.name}
        </ParagraphXSmall>
      </Block>
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale400,
            }),
          },
        }}
      >
        <Block>
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
            {formatPriceWithCommas(roundedAmount)}
          </HeadingXSmall>
          <ParagraphXSmall
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginTop: 0,
                  marginBottom: 0,
                }),
              },
            }}
          >
            {passengerCount === 1 && "Total fare"}
            {passengerCount > 1 &&
              `${currencySymbol}${formatPriceWithCommas(
                offer.total_amount
              )} total`}
          </ParagraphXSmall>
        </Block>
        <Button
          onClick={handleDetailsDrawer}
          size={SIZE.compact}
          shape={SHAPE.pill}
          endEnhancer={() => <IconChevronRight size={18} />}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale300,
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
  const router = useRouter();
  const { closeModal } = useCondor();
  const handleContinueBooking = () => {
    router.push("/flights/book");
    closeModal();
  };
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
        onClick={handleContinueBooking}
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
