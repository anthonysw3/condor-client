import React, { useState, useEffect } from "react";

// Base Web
import { Block } from "baseui/block";
import { Input } from "baseui/input";
import { Badge } from "baseui/badge";
import { ListItem, ListItemLabel } from "baseui/list";
import {
  Checkbox,
  STYLE_TYPE,
  LABEL_PLACEMENT,
  ARTWORK_SIZES,
} from "baseui/checkbox";

// Icons
import { IconLocation, IconPlaneTilt } from "@tabler/icons-react";

export default function LocationsSearch({ purpose }) {
  const [airports, setAirports] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/airports")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.airports);
        setAirports(data.airports);
      }) // We are now assuming airports is an array in the airports field
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []);

  useEffect(() => {
    console.log("airports state updated:", airports);
  }, [airports]);

  const filteredAirports = airports
    ? search
      ? airports.filter((airport) =>
          airport.name.toLowerCase().includes(search.toLowerCase())
        )
      : airports
    : [];

  return (
    <section>
      <Block>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          clearable
          placeholder={
            (purpose = "flights"
              ? "Search for a city, airport, or place"
              : "Search locations")
          }
        />
      </Block>

      <Block>
        <ListItem
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                padding: 0,
                margin: 0,
              }),
            },
            Content: {
              style: ({ $theme }) => ({
                padding: 0,
                margin: 0,
              }),
            },
          }}
          endEnhancer={() => (
            <Checkbox
              checked={checked}
              checkmarkType={STYLE_TYPE.toggle}
              onChange={(e) => setChecked(e.target.checked)}
            />
          )}
        >
          <ListItemLabel>Include nearby airports?</ListItemLabel>
        </ListItem>
        <ListItem
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                padding: 0,
                margin: 0,
              }),
            },
            Content: {
              style: ({ $theme }) => ({
                padding: 0,
                margin: 0,
              }),
            },
          }}
          artwork={() => <IconLocation size={16} />}
        >
          <ListItemLabel>Nearby airports</ListItemLabel>
        </ListItem>
        {filteredAirports.map((airport) => (
          <ListItem
            endEnhancer={() => <Badge content={airport.iata_code} />}
            overrides={{
              Root: {
                style: ({ $theme }) => ({
                  padding: 0,
                  margin: 0,
                }),
              },
              Content: {
                style: ({ $theme }) => ({
                  padding: 0,
                  margin: 0,
                }),
              },
            }}
            artwork={() => <IconPlaneTilt size={16} />}
          >
            <ListItemLabel>{airport.name}</ListItemLabel>
          </ListItem>
        ))}
      </Block>
    </section>
  );
}
