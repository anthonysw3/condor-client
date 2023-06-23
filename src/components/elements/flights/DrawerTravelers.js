import React from "react";

// Base Web
import { Block } from "baseui/block";
import { Notification } from "baseui/notification";
import { ListItem, ListItemLabel, SHAPE } from "baseui/list";

// Components
import Counter from "../global/Counter";

export default function DrawerTravelers() {
  return (
    <Block>
      <ListItem shape={SHAPE.round} endEnhancer={() => <Counter />}>
        <ListItemLabel description="Aged 13 or over">Adults</ListItemLabel>
      </ListItem>
      <ListItem shape={SHAPE.round} endEnhancer={() => <Counter />}>
        <ListItemLabel description="Aged 2 to 13">Children</ListItemLabel>
      </ListItem>
      <ListItem shape={SHAPE.round} endEnhancer={() => <Counter />}>
        <ListItemLabel description="Aged under 2">Infants</ListItemLabel>
      </ListItem>
      <Notification>Age at the time of travel</Notification>
    </Block>
  );
}
