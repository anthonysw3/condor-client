"use client";

import React from "react";

// Base Web
import { Grid, Cell } from "baseui/layout-grid";

// Components
import FlightOfferCard from "@/components/elements/flights/FlightOfferCard";
import FlightResultsHeader from "@/components/elements/flights/FlightResultsHeader";

export default function FlightResults() {
  return (
    <main>
      <Grid>
        <Cell span={4}>
          <FlightResultsHeader />
        </Cell>
      </Grid>
      <Grid>
        <Cell span={4}>
          <FlightOfferCard />
        </Cell>
        <Cell span={4}>
          <FlightOfferCard />
        </Cell>
      </Grid>
    </main>
  );
}
