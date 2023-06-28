import React, { useState, useEffect, useRef } from "react";

// Base Web
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";

// Icons
import {
  IconCurrentLocation,
  IconPlaneTilt,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";

// Condor Components
import { InputText } from "../primitives/input";
import { List } from "../primitives/list";

const testLocations = [
  {
    type: "place",
    airport: "London (All Airports)",
    name: "London",
    country: "United Kingdom",
    iata: "LON",
  },
  {
    type: "airport",
    airport: "London Heathrow",
    name: "London",
    country: "United Kingdom",
    iata: "LHR",
  },
  {
    type: "airport",
    airport: "Guangzhou Baiyun",
    name: "Guangzhou",
    country: "China",
    iata: "CAN",
  },
  {
    type: "airport",
    airport: "New York JFK",
    name: "New York",
    country: "United States",
    iata: "JFK",
  },
  {
    type: "airport",
    airport: "Las Vegas McCarran",
    name: "Las Vegas",
    country: "United States",
    iata: "LAS",
  },
  {
    type: "airport",
    airport: "Sydney Kingsford Smith",
    name: "Sydney",
    country: "Australia",
    iata: "SYD",
  },
  {
    type: "airport",
    airport: "Bangkok Suvarnabhumi",
    name: "Bangkok",
    country: "Thailand",
    iata: "BKK",
  },
  {
    type: "airport",
    airport: "Hong Kong International",
    name: "Hong Kong",
    country: "Hong Kong SAR",
    iata: "HKG",
  },
  {
    type: "airport",
    airport: "Manchester Airport",
    name: "Manchester",
    country: "United Kingdom",
    iata: "MAN",
  },
  {
    type: "airport",
    airport: "Larnaca International",
    name: "Larnaca",
    country: "Cyprus",
    iata: "LCA",
  },
  {
    type: "airport",
    airport: "Haikou Meilan",
    name: "Haikou",
    country: "China",
    iata: "HAK",
  },
];

export default function Locations({ onChange, isOpen }) {
  const [locationSearch, setLocationSearch] = useState("");
  const [nearby, setNearby] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleLocationChange = (event) => {
    setLocationSearch(event.target.value);
  };

  const handleLocationClick = (selectedLocation) => {
    setLocationSearch("");
    onChange(selectedLocation); // Invoke the onChange callback with the selected location
  };

  // Filter the testLocations based on the locationSearch value
  const filteredLocations = testLocations.filter((location) => {
    const searchTerm = locationSearch.toLowerCase();
    const airportName = location.airport.toLowerCase();
    const locationName = location.name.toLowerCase();
    const iataCode = location.iata.toLowerCase();

    return (
      airportName.includes(searchTerm) ||
      locationName.includes(searchTerm) ||
      iataCode.includes(searchTerm)
    );
  });

  return (
    <Block>
      <InputText
        label="Depart from"
        onChange={handleLocationChange}
        placeholder="Airport, name, or place"
        ref={inputRef}
        autoFocus
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
          {filteredLocations.map((location) => (
            <List
              key={location.iata}
              label={location.airport}
              description={`${location.name}, ${location.country}`}
              onClick={() => handleLocationClick(location)}
              icon={
                location.type === "airport" ? (
                  <IconPlaneTilt size={20} />
                ) : (
                  <IconBuildingSkyscraper size={20} />
                )
              }
              listEnd={
                <>
                  <Badge
                    content={location.iata}
                    hierarchy={HIERARCHY.secondary}
                    color={COLOR.primary}
                  />
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
