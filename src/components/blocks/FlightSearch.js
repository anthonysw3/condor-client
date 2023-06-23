import React, { useState } from "react";

// Base Web
import { Grid, Cell } from "baseui/layout-grid";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { ButtonGroup, MODE, SIZE, SHAPE } from "baseui/button-group";

// Primitives
import {
  InputLocation,
  InputDate,
  InputPersons,
  InputStatus,
} from "../primitives/input";

// Icons
import { IconSearch } from "@tabler/icons-react";

export default function FlightSearch() {
  const [selected, setSelected] = useState(0);
  return (
    <section>
      <ButtonGroup
        selected={selected}
        size={SIZE.mini}
        shape={SHAPE.pill}
        mode={MODE.radio}
        onClick={(_event, index) => {
          setSelected(index);
        }}
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              overflowX: "auto visible",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }),
          },
        }}
      >
        <Button>Business</Button>
        <Button>First</Button>
        <Button>Premium</Button>
        <Button>Economy</Button>
      </ButtonGroup>

      <Grid gridGaps={[12, 6, 12]} gridGutters={[12, 6, 12]} gridMargins={[0]}>
        <Cell span={[4, 8, 12]}></Cell>
        <Cell span={[4, 2, 4]}>
          <InputLocation
            label="From"
            value="London Heathrow"
            subLabel="London, United Kingdom"
          />
        </Cell>
        <Cell span={[4, 2, 4]}>
          <InputLocation
            label="To"
            value="Guangzhou Baiyun"
            subLabel="Guangzhou, China"
          />
        </Cell>
        <Cell span={[2, 2, 2]}>
          <InputDate label="Departure" date="Fri, 28 Jul" />
        </Cell>
        <Cell span={[2, 2, 2]}>
          <InputDate label="Return" date="Mon, 31 Jul" />
        </Cell>
      </Grid>
      <Grid gridGaps={[0]} gridGutters={[12, 6, 12]} gridMargins={[0]}>
        <Cell span={[4, 1, 2]}>
          <InputPersons label="Passengers" adults={2} />
        </Cell>
        <Cell span={[4, 1, 2]}>
          <InputStatus label="Frequent Flyer" />
        </Cell>
        <Cell span={[4, 1, 2]}>
          <Button
            size={SIZE.large}
            startEnhancer={<IconSearch size={18} />}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: "100%",
                  marginTop: $theme.sizing.scale800,
                }),
              },
            }}
          >
            Find flights
          </Button>
        </Cell>
      </Grid>
    </section>
  );
}
