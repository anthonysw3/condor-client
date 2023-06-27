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
import { expandBorderStyles } from "baseui/styles";

// Condor Components
import FlightResult from "@/components/blocks/FlightResult";
import { Card } from "@/components/primitives/card";

// Icons
import { IconArrowRight } from "@tabler/icons-react";

export default function FlightResults() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const {
    origin,
    destination,
    dates: { outbound, inbound },
    travelClass,
    passengers: { adults, children, infants },
  } = useSelector((state) => state.flight);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchData called");
      try {
        setIsLoading(true);

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
            passengers: [{ type: "adult" }, { type: "adult" }],
          }),
        });

        const responseData = await response.json();
        console.log(responseData);
        setData(responseData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    console.log("Before fetching data");
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

  console.log(origin.name);

  if (isLoading) {
    return <HeadingXSmall>Loading...</HeadingXSmall>;
  }

  if (data && data.offersResponse) {
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
          <IconArrowRight size={20} /> {destination.name}
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
          {outbound && dayjs(outbound).format("DD MMM")}
          {inbound && ` - ${dayjs(inbound).format("DD MMM")}`} &bull;{" "}
          {adults + children + infants} passenger
          {adults + children + infants > 1 ? "s" : ""}
        </ParagraphSmall>
        {data.offersResponse.data.map((offer, index) => (
          <FlightResult key={index} offer={offer} />
        ))}
      </main>
    );
  }

  return <HeadingXSmall>No results... yet</HeadingXSmall>;
}
