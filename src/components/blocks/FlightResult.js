import React from "react";
import { useRouter } from "next/navigation";

// Base Web
import { Block } from "baseui/block";
import {
  ParagraphXSmall,
  HeadingXSmall,
  LabelSmall,
  LabelXSmall,
} from "baseui/typography";
import { Button, SIZE, SHAPE } from "baseui/button";
import { useStyletron } from "baseui";

// Primitives
import { Card } from "../primitives/card";

// Components
import FlightDetails from "./FlightDetails";
import FlightSlice from "./FlightSlice";
import Slice from "./Slice";

// Icons
import { IconChevronRight } from "@tabler/icons-react";

// Providers
import { useLayer } from "../../contexts/LayerProvider";

// Store
import { useSelector, useDispatch } from "react-redux";
import { setFlightOfferId } from "../utils/store/slices/flightOfferSlice";

// Helpers
import {
  getCurrencySymbol,
  formatPriceWithCommas,
} from "../utils/helpers/currencyUtils";

export default function FlightResult({
  offer,
  cheapest,
  fastest,
  isSimilarOffer,
}) {
  // Provider Functions
  const { openLayer, closeLayer } = useLayer();
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

  const dispatch = useDispatch();

  // Handlers
  const handleDetailsDrawer = () => {
    console.log("Offer ID:", offer.id); // <-- Log the offer id before dispatching
    dispatch(setFlightOfferId(offer.id));
    const title = `Trip to ${destination.name}`;
    const content = <FlightDetails offer={offer} />;
    const footer = <Footer />;

    openLayer(title, content, footer);
  };

  console.log("FlightResult ID", offer.id);

  return (
    <Block onClick={handleDetailsDrawer}>
      <Card onClick={handleDetailsDrawer} cheapest={cheapest} fastest={fastest}>
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: $theme.sizing.scale600,
                borderBottom: `2px dotted ${$theme.colors.primary100}`,
                paddingBottom: $theme.sizing.scale500,
              }),
            },
          }}
        >
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  margin: 0,
                }),
              },
            }}
          >
            <Block
              as="img"
              src={offer.owner.logo_symbol_url}
              alt="Image"
              height="26px"
              width="26px"
            />
            <LabelSmall
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginLeft: $theme.sizing.scale300,
                  }),
                },
              }}
            >
              {offer.owner.name}
            </LabelSmall>
          </Block>
          <Block>
            <HeadingXSmall
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginTop: 0,
                    marginBottom: 0,
                    fontWeight: "bold",
                  }),
                },
              }}
            >
              {currencySymbol}
              {formatPriceWithCommas(roundedAmount)}
            </HeadingXSmall>
          </Block>
        </Block>
        {offer.slices.map((slice, index) => (
          <Slice key={index} slice={slice} />
        ))}
      </Card>
    </Block>
  );
}

function Footer() {
  const router = useRouter();
  const { closeLayer } = useLayer();
  const handleContinueBooking = () => {
    router.push("/flights/book");
    closeLayer();
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
