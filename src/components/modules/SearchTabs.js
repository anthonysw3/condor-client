import React, { useState } from "react";

// Base Web
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { ButtonGroup, MODE, SIZE, SHAPE } from "baseui/button-group";
import { Grid, Cell } from "baseui/layout-grid";

// Icons
import { ChevronDown } from "baseui/icon";
import { IconPlane, IconBed } from "@tabler/icons-react";

// Components
import FlightSearch from "./FlightSearch";
import FlightTabs from "./FlightTabs";

export default function SearchTabs() {
  const [selected, setSelected] = useState(0);

  const renderComponent = () => {
    switch (selected) {
      case 0:
        return (
          <div>
            <FlightTabs />
          </div>
        );
      case 1:
        return <div></div>;
      default:
        return null;
    }
  };

  return (
    <section>
      <Grid>
        <Cell span={[4]}>
          <ButtonGroup
            mode={MODE.radio}
            size={SIZE.compact}
            shape={SHAPE.pill}
            selected={selected}
            onClick={(_event, index) => {
              setSelected(index);
            }}
            overrides={{
              Root: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale400,
                }),
              },
            }}
          >
            <Button key={0} startEnhancer={<IconPlane size={20} />}>
              Flights
            </Button>
            <Button key={1} startEnhancer={<IconBed size={20} />}>
              Stays
            </Button>
          </ButtonGroup>
        </Cell>
      </Grid>
      {renderComponent()}
    </section>
  );
}
