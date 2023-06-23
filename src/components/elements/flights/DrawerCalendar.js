import React from "react";

// Base Web
import { ORIENTATION, StatefulCalendar } from "baseui/datepicker";

export default function DrawerCalendar() {
  return (
    <StatefulCalendar
      onChange={({ date }) => console.log(date)}
      orientation={ORIENTATION.vertical}
      monthsShown={12}
      range
    />
  );
}
