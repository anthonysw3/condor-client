import React, { useState } from "react";

// Primitives
import { Tabs, Tab } from "../primitives/tabs";

// Blocks
import FlightSearch from "../blocks/FlightSearch";

// Icons
import { IconPlane, IconHotelService } from "@tabler/icons-react";

export default function SearchTabs() {
  return (
    <Tabs>
      <Tab label="Flights" icon={<IconPlane size={18} />}>
        <FlightSearch />
      </Tab>
      <Tab label="Stays" icon={<IconHotelService size={18} />}></Tab>
    </Tabs>
  );
}
