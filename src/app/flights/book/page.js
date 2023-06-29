"use client";

import React, { useEffect, useState } from "react";

// Base Web
import { Block } from "baseui/block";
import { HeadingXSmall, ParagraphSmall } from "baseui/typography";

export default function FlightBooking() {
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
        Book flight
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
      ></ParagraphSmall>
    </main>
  );
}
