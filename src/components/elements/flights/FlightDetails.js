import React, { useState } from "react";

// Base Web
import { Input } from "baseui/input";
import { Grid, Cell } from "baseui/layout-grid";

// Icons
import { IconUsers } from "@tabler/icons-react";

// Components
import FormControlWithDrawer from "../global/FormControlWithDrawer";
import DrawerTravelers from "./DrawerTravelers";

export default function FlightDetails() {
  const [travelers, setTravelers] = useState("1");

  return (
    <Grid>
      <Cell span={2}>
        <FormControlWithDrawer key="travelers" content={<DrawerTravelers />}>
          <Input
            value={travelers}
            startEnhancer={<IconUsers size={16} />}
            onChange={(e) => setTravelers(e.target.value)}
            placeholder="Travelers"
          />
        </FormControlWithDrawer>
      </Cell>
    </Grid>
  );
}
