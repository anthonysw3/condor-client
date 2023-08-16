import React, { useState, useEffect, useRef } from "react";
import { Block } from "baseui/block";
import { Button, SIZE, SHAPE, KIND } from "baseui/button";
import { IconCurrentLocation } from "@tabler/icons-react";
import { InputText } from "../primitives/input";
import { List } from "../primitives/list";

// Sanity
import { urlFor } from "../../services/global/imageUrlBuilder";

const Status = ({ onChange, isOpen, mode }) => {
  const [airlineSearch, setAirlineSearch] = useState("");
  const [filteredAirlines, setFilteredAirlines] = useState([]);
  const inputRef = useRef(null);

  const handleAirlineChange = (event) => {
    setAirlineSearch(event.target.value);
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Debounce the search operation
    const delaySearch = setTimeout(() => {
      if (airlineSearch.length >= 2) {
        fetch(`http://192.168.0.227:5000/api/airlines?q=${airlineSearch}`)
          .then((response) => response.json())
          .then((data) => setFilteredAirlines(data)); // Changed this line
      } else {
        setFilteredAirlines([]); // And this line
      }
    }, 300);

    // Cleanup the timeout on each input change
    return () => clearTimeout(delaySearch);
  }, [airlineSearch]);

  const handleAirlineClick = (selectedAirline) => {
    setAirlineSearch("");
    onChange(selectedAirline);
  };

  return (
    <Block>
      <InputText
        label="Search airlines"
        onChange={handleAirlineChange}
        placeholder="Airline or reward scheme"
        ref={inputRef}
        autoFocus
      />
      {airlineSearch && filteredAirlines.length > 0 ? (
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale600,
              }),
            },
          }}
        >
          {filteredAirlines.map((airline) => {
            return (
              <List
                key={airline.iata_code}
                label={airline.name}
                description={
                  airline.frequent_flyer_program?.program_name
                    ? airline.frequent_flyer_program.program_name
                    : null
                }
                icon={
                  <Block
                    as="img"
                    src={
                      airline.logo_symbol?.asset
                        ? urlFor(airline.logo_symbol).width(28).url()
                        : null
                    }
                    height="32px"
                    width="32px"
                    alt={airline.name}
                  />
                }
                listEnd={
                  <Button
                    onClick={() => alert("click")}
                    size={SIZE.mini}
                    shape={SHAPE.pill}
                    kind={KIND.secondary}
                  >
                    Add
                  </Button>
                }
              />
            );
          })}
        </Block>
      ) : (
        <Block></Block>
      )}
    </Block>
  );
};

export default Status;
