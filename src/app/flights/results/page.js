"use client";

import React, { useEffect, useState } from "react";

// Redux
import { useSelector } from "react-redux";

// Day.js
import dayjs from "dayjs";

// Base Web
import { Block } from "baseui/block";
import { HeadingXSmall } from "baseui/typography";
import { Button, KIND, SIZE } from "baseui/button";

// Condor Components
import FlightResult from "@/components/blocks/FlightResult";
import { FlightResultSkeleton } from "@/components/containers/Skeletons";

// Icons
import {
  IconArrowRight,
  IconChevronDown,
  IconArrowsDiff,
} from "@tabler/icons-react";

// Helpers
import { getTotalDuration } from "../../../components/utils/helpers/flightUtils";
import { formatDatetoDateMonth } from "../../../components/utils/helpers/dateUtils";

// API Fetch
import { fetchFlightOffers } from "../../../services/flights/duffelApi";

export default function FlightResults() {
  // State
  const [isLoading, setIsLoading] = useState(true); // API loading
  const [after, setAfter] = useState(null); // API pagination
  const [data, setData] = useState([]); // API response

  // Store
  const {
    origin,
    destination,
    dates: { outbound, inbound },
    travelClass,
    passengers: { adults, children, infants },
  } = useSelector((state) => state.flight);

  // Fetch Flight Offers
  const getFlightOffers = async () => {
    try {
      const flightOffers = await fetchFlightOffers({
        origin,
        destination,
        outbound,
        inbound,
        travelClass,
        adults,
        children,
        infants,
        after,
      });
      const offers = flightOffers.offersResponse?.data || [];
      const newAfter = flightOffers.offersResponse?.meta?.after || null;

      setData((prevData) => [...prevData, ...offers]);
      setAfter(newAfter);

      if (!newAfter) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getFlightOffers();
  }, [
    origin,
    destination,
    outbound,
    inbound,
    travelClass,
    adults,
    children,
    infants,
  ]);

  useEffect(() => {
    if (after) {
      getFlightOffers();
    }
  }, [after]);

  return (
    <main>
      <HeadingXSmall
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              display: "flex",
              alignItems: "center",
              marginTop: 0,
              marginBottom: 0,
              marginLeft: $theme.sizing.scale200,
            }),
          },
        }}
      >
        {origin.name}
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginLeft: $theme.sizing.scale300,
                marginRight: $theme.sizing.scale300,
                display: "flex",
                alignItems: "center",
              }),
            },
          }}
        >
          {destination ? (
            <IconArrowsDiff size={20} />
          ) : (
            <IconArrowRight size={20} />
          )}
        </Block>
        {destination.name}
      </HeadingXSmall>

      <Block
        size={SIZE.mini}
        kind={KIND.secondary}
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              display: "flex",
              overflowX: "scroll",
              flexWrap: "nowrap",
              marginTop: $theme.sizing.scale200,
              marginLeft: `-${$theme.sizing.scale600}`,
              marginRight: `-${$theme.sizing.scale600}`,
              paddingLeft: $theme.sizing.scale700,
              paddingRight: $theme.sizing.scale600,
              WebkitOverflowScrolling: "touch",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }),
          },
        }}
      >
        <Button
          size={SIZE.mini}
          kind={KIND.secondary}
          endEnhancer={() => <IconChevronDown size={16} />}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                flex: "0 0 auto",
                whiteSpace: "nowrap",
                border: `1px solid ${$theme.colors.primary200}`,
                marginRight: $theme.sizing.scale200,
              }),
            },
          }}
        >{`${formatDatetoDateMonth(outbound)}${
          inbound ? ` - ${formatDatetoDateMonth(inbound)}` : ""
        }`}</Button>
        <Button
          size={SIZE.mini}
          kind={KIND.secondary}
          endEnhancer={() => <IconChevronDown size={16} />}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                flex: "0 0 auto",
                whiteSpace: "nowrap",
                border: `1px solid ${$theme.colors.primary200}`,
                marginRight: $theme.sizing.scale200,
              }),
            },
          }}
        >{`${adults + children + infants} passenger${
          adults + children + infants > 1 ? "s" : ""
        }`}</Button>
        <Button
          size={SIZE.mini}
          kind={KIND.secondary}
          endEnhancer={() => <IconChevronDown size={16} />}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                flex: "0 0 auto",
                whiteSpace: "nowrap",
                border: `1px solid ${$theme.colors.primary200}`,
                marginRight: $theme.sizing.scale200,
              }),
            },
          }}
        >
          {travelClass}
        </Button>
      </Block>

      {isLoading && (
        <Block>
          <FlightResultSkeleton />
          <FlightResultSkeleton />
          <FlightResultSkeleton />
          <FlightResultSkeleton />
        </Block>
      )}

      {data
        .sort((a, b) => a.total_amount - b.total_amount) // Sort by cheapest
        .sort(
          (a, b) => getTotalDuration(a.slices) - getTotalDuration(b.slices) // Sort by fastest
        )
        .filter((offer, index, array) => {
          const lowestPrice = array[0].total_amount; // Get the lowest price
          const maxPrice = lowestPrice * 5; // Calculate the maximum allowed price (500% of the lowest price)
          return offer.total_amount <= maxPrice; // Filter out offers with price exceeding the maximum
        })
        .filter((offer) => offer.owner.iata_code !== "ZZ") // Filter out results from owner with iata_code ZZ
        .map((offer, index) => {
          const isCheapest = index === 0; // Check if it's the cheapest offer
          const isFastest = index === 1; // Check if it's the fastest offer

          return (
            <FlightResult
              key={index}
              offer={offer}
              cheapest={isCheapest}
              fastest={isFastest}
            />
          );
        })}
    </main>
  );
}
