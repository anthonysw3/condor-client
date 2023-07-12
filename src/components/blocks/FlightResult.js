import React from "react";
import { useRouter } from "next/navigation";

// Base Web
import { Block } from "baseui/block";
import { ParagraphXSmall, HeadingXSmall, LabelXSmall } from "baseui/typography";
import { Button, SIZE, SHAPE } from "baseui/button";
import { useStyletron } from "baseui";

// Primitives
import { Card } from "../primitives/card";

// Components
import FlightDetails from "./FlightDetails";
import FlightSlice from "./FlightSlice";

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

export default function FlightResult({ offer, cheapest, fastest }) {
  // Base Web
  const [css, $theme] = useStyletron();
  // Provider Functions
  const { openLayer, closeLayer } = useLayer();
  console.log(offer);
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

  return (
    <Card onClick={handleDetailsDrawer} cheapest={cheapest} fastest={fastest}>
      {cheapest && <div></div>}
      {fastest && <div></div>}
      <LabelXSmall
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              color: $theme.colors.primary500,
              marginBottom: $theme.sizing.scale300,
            }),
          },
        }}
      >
        {offer.owner.name}
      </LabelXSmall>
      {offer.slices.map((slice, index) => (
        <FlightSlice key={index} slice={slice} />
      ))}
      {/*<Container style={{ padding: 0 }}>
        <Block
          display="flex"
          alignItems="center"
          justifyContent="center"
          overrides={{
            Block: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },
          }}
        >
          <Block
            width="26px"
            height="26px"
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  borderRadius: "50%",
                  backgroundColor: $theme.colors.primary50,
                  marginLeft: "-30px",
                }),
              },
            }}
          />
          <Block
            flex="1"
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  height: "1px",
                  borderTop: `4px dashed ${$theme.colors.primary50}`,
                }),
              },
            }}
          />
          <Block
            width="26px"
            height="26px"
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  borderRadius: "50%",
                  backgroundColor: $theme.colors.primary50,
                  marginRight: "-30px",
                }),
              },
            }}
          />
        </Block>
          </Container>*/}

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
                  marginTop: $theme.sizing.scale100,
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
                marginTop: 0,
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
