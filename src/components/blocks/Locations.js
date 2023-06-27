import React, { useState } from "react";

// Base Web
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";

// Icons
import { IconCurrentLocation } from "@tabler/icons-react";

// Condor Components
import { InputText } from "../primitives/input";
import { List } from "../primitives/list";

const testLocations = [
  {
    airport: "London Heathrow",
    city: "London",
    country: "United Kingdom",
    iata: "LHR",
  },
  {
    airport: "Guangzhou Baiyun",
    city: "Guangzhou",
    country: "China",
    iata: "CAN",
  },
  {
    airport: "New York JFK",
    city: "New York",
    country: "United States",
    iata: "JFK",
  },
  {
    airport: "Las Vegas McCarran",
    city: "Las Vegas",
    country: "United States",
    iata: "LAS",
  },
  {
    airport: "Sydney Kingsford Smith",
    city: "Sydney",
    country: "Australia",
    iata: "SYD",
  },
  {
    airport: "Bangkok Suvarnabhumi",
    city: "Bangkok",
    country: "Thailand",
    iata: "BKK",
  },
  {
    airport: "Hong Kong International",
    city: "Hong Kong",
    country: "Hong Kong SAR",
    iata: "HKG",
  },
  {
    airport: "Manchester Airport",
    city: "Manchester",
    country: "United Kingdom",
    iata: "MAN",
  },
  {
    airport: "Larnaca International",
    city: "Larnaca",
    country: "Cyprus",
    iata: "LCA",
  },
];

export default function Locations({ onChange }) {
  const [locationSearch, setLocationSearch] = useState("");
  const [nearby, setNearby] = useState(false);

  const handleLocationChange = (event) => {
    setLocationSearch(event.target.value);
  };

  const handleLocationClick = (selectedLocation) => {
    setLocationSearch("");
    onChange(selectedLocation); // Invoke the onChange callback with the selected location
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
      {locationSearch ? (
        <Block>
          {testLocations.map((location) => (
            <List
              key={location.iata}
              label={location.airport}
              description={`${location.city}, ${location.country}`}
              listEnd={
                <>
                  <Badge
                    content={location.iata}
                    hierarchy={HIERARCHY.secondary}
                    color={COLOR.primary}
                  />
                  <Button onClick={() => handleLocationClick(location)}>
                    Update
                  </Button>
                </>
              }
            />
          ))}
        </Block>
      ) : (
        <Block>
          <List icon={<IconCurrentLocation size={20} />} label="Around me?" />
        </Block>
      )}
    </Block>
  );
}
