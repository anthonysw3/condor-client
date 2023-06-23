import React, { useState } from "react";

// Base Web
import { Button } from "baseui/button";
import { useStyletron } from "baseui";

// Components
import DrawerBlock from "../global/DrawerBlock";
import FlightSliceDropdown from "./FlightSliceDropdown";
import FlightResultsHeader from "./FlightResultsHeader";

// Icons
import { IconChevronRight } from "@tabler/icons-react";

export default function FlightOfferDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [css] = useStyletron();
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      })}
    >
      <DrawerBlock>
        <FlightResultsHeader />
      </DrawerBlock>
      <FlightSliceDropdown />
      <FlightSliceDropdown />
      <DrawerBlock>
        <Button
          endEnhancer={() => <IconChevronRight size={24} />}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                width: "100%",
                marginTop: $theme.sizing.scale500,
                marginBottom: $theme.sizing.scale500,
              }),
            },
          }}
        >
          Continue to book
        </Button>
      </DrawerBlock>
    </section>
  );
}
