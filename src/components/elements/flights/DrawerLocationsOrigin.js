import React from "react";

// Base Web
import { Block } from "baseui/block";

// Components
import UtilityDrawerHeader from "../global/UtilityDrawerHeader";
import LocationsSearch from "./LocationsSearch";
import DrawerBlock from "../global/DrawerBlock";

export default function DrawerLocationsOrigin() {
  return (
    <section>
      <UtilityDrawerHeader title="Where from?" />
      <DrawerBlock>
        <Block marginTop="scale600">
          <LocationsSearch purpose="flights" />
        </Block>
      </DrawerBlock>
    </section>
  );
}
