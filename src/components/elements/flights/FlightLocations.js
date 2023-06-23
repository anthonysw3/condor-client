import React from "react";

// Base Web
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import { Grid, Cell } from "baseui/layout-grid";

// Icons
import {
  IconPlaneArrival,
  IconPlaneDeparture,
  IconArrowsDownUp,
} from "@tabler/icons-react";

// Components
import FormControlWithDrawer from "../global/FormControlWithDrawer";
import DrawerLocationsOrigin from "./DrawerLocationsOrigin";
import DrawerLocationsDestination from "./DrawerLocationsDestination";

export default function FlightLocations() {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleSwap = (e) => {
    e.preventDefault();
    setFrom(to);
    setTo(from);
  };
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <article>
      <Grid>
        <Cell span={4}>
          <Block position="relative">
            <FormControlWithDrawer
              key="origin"
              content={<DrawerLocationsOrigin />}
            >
              <Input
                startEnhancer={<IconPlaneDeparture size={16} />}
                placeholder="From"
              />
            </FormControlWithDrawer>
            <FormControlWithDrawer
              key="origin"
              content={<DrawerLocationsDestination />}
            >
              <Input
                startEnhancer={<IconPlaneArrival size={16} />}
                placeholder="To"
              />
            </FormControlWithDrawer>
            <Button
              onClick={handleSwap}
              overrides={{
                BaseButton: {
                  style: {
                    position: "absolute",
                    top: "50%",
                    right: "2rem",
                    transform: "translateY(-50%)",
                  },
                },
              }}
            >
              <IconArrowsDownUp size={16} />
            </Button>
          </Block>
        </Cell>
      </Grid>
    </article>
  );
}
