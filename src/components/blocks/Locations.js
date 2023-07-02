import React, { useState, useEffect, useRef } from "react";
import { Block } from "baseui/block";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import {
  IconCurrentLocation,
  IconPlaneTilt,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";
import { InputText } from "../primitives/input";
import { List } from "../primitives/list";

const Locations = ({ onChange, isOpen }) => {
  const [locationSearch, setLocationSearch] = useState("");
  const [nearby, setNearby] = useState(false);
  const [isAskingForLocation, setIsAskingForLocation] = useState(false);
  const [filteredLoc, setFilteredLoc] = useState([]);
  const inputRef = useRef(null);
  const workerRef = useRef(null);

  const handleLocationChange = (event) => {
    setLocationSearch(event.target.value);
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Debounce the search operation
    const delaySearch = setTimeout(() => {
      if (locationSearch.length >= 2) {
        fetch(`http://localhost:5000/api/airports?q=${locationSearch}`)
          .then((response) => response.json())
          .then((data) => setFilteredLoc(data));
      } else {
        setFilteredLoc([]);
      }
    }, 300);

    // Cleanup the timeout on each input change
    return () => clearTimeout(delaySearch);
  }, [locationSearch]);

  const handleLocationClick = (selectedLocation) => {
    if (
      selectedLocation.type === "place" &&
      selectedLocation.label === "Around me?"
    ) {
      setIsAskingForLocation(true);
    } else {
      setLocationSearch("");
      onChange(selectedLocation);
    }
  };

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
      {locationSearch && filteredLoc.length > 0 ? (
        <Block>
          {filteredLoc.map((location) => (
            <List
              key={location.iata}
              label={location.airport}
              description={`${location.name}, ${location.country}`}
              onClick={() => handleLocationClick(location)}
              icon={
                location.type === "place" ? (
                  <IconBuildingSkyscraper size={20} />
                ) : (
                  <IconPlaneTilt size={20} />
                )
              }
              listEnd={
                <Badge
                  content={location.iata}
                  hierarchy={HIERARCHY.secondary}
                  color={COLOR.primary}
                />
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
};

export default Locations;
