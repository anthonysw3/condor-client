import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Base Web
import { Datepicker } from "baseui/datepicker";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Grid, Cell } from "baseui/layout-grid";
import { FormControl } from "baseui/form-control";

// Icons
import { IconCalendar, IconPlus, IconUsers } from "@tabler/icons-react";

// Components
import FormControlWithDrawer from "../global/FormControlWithDrawer";
import DrawerTravelers from "./DrawerTravelers";
import DrawerCalendar from "./DrawerCalendar";

export default function FlightDates() {
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [showDateTo, setShowDateTo] = useState(false);
  const [travelers, setTravelers] = useState("1");

  const handleAddDate = () => {
    setShowDateTo(true);
  };

  return (
    <Grid gridColumns={16} gridGutters={[4]}>
      <Cell span={10}>
        <FormControlWithDrawer key="dateOut" content={<DrawerCalendar />}>
          <Datepicker
            startEnhancer={<IconCalendar size={16} />}
            value={dateFrom}
            onChange={({ date }) => setDateFrom(date)}
            placeholder="Dates"
          />
        </FormControlWithDrawer>
      </Cell>
      <Cell span={6}>Return?</Cell>
    </Grid>
  );
}
