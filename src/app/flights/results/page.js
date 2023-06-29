"use client";

import React, { useEffect, useState } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Day.js
import dayjs from "dayjs";

// Base Web
import { Block } from "baseui/block";
import { HeadingXSmall, ParagraphSmall } from "baseui/typography";
import { Notification } from "baseui/notification";
import { Button, KIND, SIZE } from "baseui/button";

// Condor Components
import FlightResult from "@/components/blocks/FlightResult";
import { FlightResultSkeleton } from "@/components/blocks/FlightResult";
import { Card } from "@/components/primitives/card";
import { ScrollingButtonCompact } from "@/components/primitives/button";

// Icons
import {
  IconArrowRight,
  IconChevronDown,
  IconArrowsDiff,
} from "@tabler/icons-react";

export default function FlightResults() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const [after, setAfter] = useState(null); // new state variable

  const {
    origin,
    destination,
    dates: { outbound, inbound },
    travelClass,
    passengers: { adults, children, infants },
  } = useSelector((state) => state.flight);

  const [data, setData] = useState([]);

  const fetchData = async () => {
    const passengerArray = [];

    for (let i = 0; i < adults; i++) {
      passengerArray.push({ age: 21 });
    }

    for (let i = 0; i < children; i++) {
      passengerArray.push({ age: 12 });
    }

    for (let i = 0; i < infants; i++) {
      passengerArray.push({ age: 1 });
    }
    console.log(passengerArray);
    try {
      const response = await fetch("http://192.168.0.227:5000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          outbound: {
            origin: origin.iata,
            destination: destination.iata,
            date: outbound,
          },
          returnJourney: inbound
            ? {
                origin: destination.iata,
                destination: origin.iata,
                date: inbound,
              }
            : null,
          cabin_class: travelClass,
          passengers: passengerArray,
          after: after,
        }),
      });

      const responseData = await response.json();
      const offers = responseData.offersResponse?.data || [];
      const newAfter = responseData.offersResponse?.meta?.after || null;

      setData((prevData) => [...prevData, ...offers]);
      setAfter(newAfter);

      console.log("Success:", responseData);

      if (!newAfter) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
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
      fetchData();
    }
  }, [after]);

  const cardCount = 10;

  const buttonOverrides = {
    BaseButton: {
      style: {
        flexShrink: 0,
      },
    },
  };

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
        >{`${outbound && dayjs(outbound).format("DD MMM")}${
          inbound ? ` - ${dayjs(inbound).format("DD MMM")}` : ""
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

const getTotalDuration = (slices) => {
  let totalDuration = 0;
  slices.forEach((slice) => {
    slice.segments.forEach((segment) => {
      totalDuration += segment.duration;
    });
  });
  return totalDuration;
};
