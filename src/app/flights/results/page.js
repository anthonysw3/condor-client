"use client";

import React, { useEffect, useState } from "react";

// Redux
import { useSearchParams } from "next/navigation";

// Day.js
import dayjs from "dayjs";

// Base Web
import { Block } from "baseui/block";
import { HeadingXSmall, ParagraphSmall } from "baseui/typography";
import { Notification } from "baseui/notification";
import { expandBorderStyles } from "baseui/styles";

// Condor Components
import FlightResult from "@/components/blocks/FlightResult";
import { Card } from "@/components/primitives/card";

// Icons
import { IconArrowRight } from "@tabler/icons-react";

export default function FlightResults() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const origin = searchParams.get("originIata");
  const originDisplay = searchParams.get("originName");
  const destination = searchParams.get("destinationIata");
  const destinationDisplay = searchParams.get("destinationName");
  const date = searchParams.get("outboundDate");
  const returnDate = searchParams.get("inboundDate");
  const cabinClass = searchParams.get("travelClass");

  useEffect(() => {
    if (searchParams) {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          const response = await fetch("http://localhost:5000/api/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              outbound: { origin, destination, date },
              returnJourney: returnDate
                ? { origin: destination, destination: origin, date: returnDate }
                : null,
              cabin_class: cabinClass,
              passengers: [{ type: "adult" }, { type: "adult" }],
            }),
          });

          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error("Error:", error);
          // handle error here, for example by setting an error state
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [searchParams]);

  console.log(data);

  if (isLoading) {
    return <HeadingXSmall>Loading...</HeadingXSmall>;
  }

  if (data) {
    return (
      <main>
        <HeadingXSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: 0,
                marginBottom: 0,
                marginLeft: $theme.sizing.scale200,
              }),
            },
          }}
        >
          {originDisplay} <IconArrowRight size={20} /> {destinationDisplay}
        </HeadingXSmall>
        <ParagraphSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale100,
                marginBottom: 0,
                marginLeft: $theme.sizing.scale200,
              }),
            },
          }}
        >
          {date && dayjs(date).format("DD MMM")}
          {returnDate && ` - ${dayjs(returnDate).format("DD MMM")}`} &bull; 2
          passengers
        </ParagraphSmall>
        <Notification
          closeable
          overrides={{
            Body: {
              style: ({ $theme }) => ({
                width: "auto",
                ...expandBorderStyles($theme.borders.border600),
              }),
            },
          }}
        >
          How are these results ordered?
        </Notification>
        {data.offersResponse.data.map((offer, index) => (
          <FlightResult
            key={index}
            offer={offer}
            outboundSegments={offer.slices[0].segments.length}
            inboundSegments={offer.slices[0].segments.length}
          />
        ))}
      </main>
    );
  }

  return <HeadingXSmall>No results... yet</HeadingXSmall>;
}
