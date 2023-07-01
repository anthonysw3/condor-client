import React from "react";
import { useRouter } from "next/navigation";

// Base Web
import { Block } from "baseui/block";
import { ParagraphXSmall, HeadingXSmall } from "baseui/typography";
import { Button, SIZE, SHAPE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";

// Primitives
import { Card } from "../primitives/card";

// Components
import FlightDetails from "./FlightDetails";
import FlightSlice from "./FlightSlice";

// Icons
import { IconChevronRight } from "@tabler/icons-react";

// Providers
import { useCondor } from "../utils/providers/CondorProvider";

// Store
import { useSelector } from "react-redux";

// Helpers
import {
  getCurrencySymbol,
  formatPriceWithCommas,
} from "../utils/helpers/currencyUtils";

export default function FlightResult({ offer, cheapest, fastest }) {
  // Provider Functions
  const { openModal, closeModal } = useCondor();

  const {
    origin,
    destination,
    dates: { outbound, inbound },
    travelClass,
    passengers: { adults, children, infants },
  } = useSelector((state) => state.flight);

  // Helpers
  // Convert currency code to symbol
  const currencySymbol = getCurrencySymbol(offer.total_currency);
  // Calculate the number of passengers
  const passengerCount = offer.passengers.length;
  // Calculate amount per passenger
  const amountPerPassenger = offer.total_amount / passengerCount;
  // Round up amount per passenger to the nearest whole number
  const roundedAmount = Math.ceil(amountPerPassenger);
  // Determine if the offer is the cheapest

  // Handlers
  const handleDetailsDrawer = () => {
    const title = `Trip to ${destination.name}`;
    const content = <FlightDetails offer={offer} />;
    const footer = <Footer />;

    openModal(title, content, footer);
  };

  return (
    <Card onClick={handleDetailsDrawer} cheapest={cheapest} fastest={fastest}>
      {cheapest && <div></div>}
      {fastest && <div></div>}
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
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
          onClick={handleDetailsDrawer}
        >
          Select
        </Button>
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
