import React from "react";

// Base Web
import { Button } from "baseui/button";
import { Grid } from "baseui/layout-grid";

// Icons
import { Search } from "baseui/icon";

// Components
import FlightLocations from "../elements/flights/FlightLocations";
import FlightDates from "../elements/flights/FlightDates";
import FlightDetails from "../elements/flights/FlightDetails";
import Status from "../elements/flights/Status";

export default function FlightSearch() {
  return (
    <section>
      <p>V1</p>
      <FlightLocations />
      <FlightDates />
      <FlightDetails />
      <Status />
      <Grid>
        <Button
          startEnhancer={<Search />}
          overrides={{
            BaseButton: {
              style: {
                width: "100%",
              },
            },
          }}
        >
          Search
        </Button>
      </Grid>
    </section>
  );
}
