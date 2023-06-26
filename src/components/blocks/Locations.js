import React, { useState } from "react";

// Base Web
import { Block } from "baseui/block";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { Checkbox, STYLE_TYPE, LABEL_PLACEMENT } from "baseui/checkbox";
import { ListItem, ListItemLabel } from "baseui/list";

// Icons
import { IconCurrentLocation, IconPlaneTilt } from "@tabler/icons-react";

// Condor Components
import { InputText } from "../primitives/input";
import { List } from "../primitives/list";

export default function Locations({ origin, flights }) {
  const [location, setLocation] = useState("");
  const [nearby, setNearby] = useState(false);
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <Block>
      <InputText
        label="Depart from"
        onChange={handleLocationChange}
        placeholder="Airport, city, or place"
      />
      <Block
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale700,
            }),
          },
        }}
      >
        <List
          label="Include nearby airports?"
          listEnd={
            <Checkbox
              checked={nearby}
              checkmarkType={STYLE_TYPE.toggle}
              onChange={(e) => setNearby(e.target.checked)}
            />
          }
        />
      </Block>
      {location ? (
        <Block>
          <List
            icon={<IconPlaneTilt size={20} />}
            label="London Heathrow"
            description="London, United Kingdom"
            listEnd={
              <Badge
                content="LHR"
                hierarchy={HIERARCHY.secondary}
                color={COLOR.primary}
              />
            }
          />
        </Block>
      ) : (
        <Block>
          <List icon={<IconCurrentLocation size={20} />} label="Around me?" />
        </Block>
      )}
    </Block>
  );
}
