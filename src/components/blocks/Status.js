import React, { useState, useEffect, useRef } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { addProgram, removeProgram } from "../utils/slices/statusSlice";

// Base Web
import { Block } from "baseui/block";
import { Button, KIND, SIZE, SHAPE } from "baseui/button";
import { ParagraphMedium } from "baseui/typography";

// Icons
import { IconX } from "@tabler/icons-react";

// Condor Components
import { InputText } from "../primitives/input";
import { List } from "../primitives/list";

// Fuse
import Fuse from "fuse.js";

// Airlines Data
import { airlineData } from "../utils/airlines";

export default function Status() {
  const dispatch = useDispatch();
  const [airlineSearch, setAirlineSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredAirlines, setFilteredAirlines] = useState([]);
  const inputRef = useRef(null);
  const selectedAirlines = useSelector((state) => state.status);

  useEffect(() => {
    if (isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const fuse = new Fuse(airlineData, {
      keys: ["name", "iata"],
      threshold: 0.3,
    });

    const searchResults = fuse.search(airlineSearch.toLowerCase());
    setFilteredAirlines(searchResults.map((result) => result.item));
  }, [airlineSearch]);

  const handleAirlineChange = (event) => {
    setAirlineSearch(event.target.value);
  };

  const handleAirlineClick = (selectedAirline) => {
    console.log(selectedAirline);
    dispatch(addProgram(selectedAirline));
    setAirlineSearch("");
  };

  const handleRemoveAirline = (index) => {
    dispatch(removeProgram(selectedAirlines[index]));
  };

  return (
    <Block>
      <InputText
        label="Airline"
        onChange={handleAirlineChange}
        placeholder="Search for an airline"
        inputRef={inputRef}
      />
      {airlineSearch && filteredAirlines.length > 0 ? (
        <Block>
          {filteredAirlines.map((airline) => (
            <Block
              key={airline.name}
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginTop: $theme.sizing.scale700,
                  }),
                },
              }}
            >
              <List
                icon={
                  <Block
                    as="img"
                    src={airline.logo}
                    alt={airline.name}
                    width="30px"
                    height="30px"
                  />
                }
                label={airline.name}
                description={airline.program.name}
                listEnd={
                  <Button
                    kind={KIND.secondary}
                    size={SIZE.mini}
                    shape={SHAPE.pill}
                    onClick={() => handleAirlineClick(airline)}
                  >
                    Add
                  </Button>
                }
              />
            </Block>
          ))}
        </Block>
      ) : (
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale700,
              }),
            },
          }}
        >
          {selectedAirlines && selectedAirlines.length > 0 ? (
            selectedAirlines.map((airline, index) => (
              <List
                key={index}
                icon={
                  <Block
                    as="img"
                    src={airline.logo}
                    alt={airline.name}
                    width="30px"
                    height="30px"
                    overrides={{
                      Block: {
                        style: ({ $theme }) => ({
                          borderRadius: $theme.borders.radius300,
                        }),
                      },
                    }}
                  />
                }
                label={airline.name}
                description={airline.program.name}
                listEnd={
                  <Button
                    kind={KIND.secondary}
                    size={SIZE.mini}
                    shape={SHAPE.circle}
                    onClick={() => handleRemoveAirline(index)}
                  >
                    <IconX size={12} />
                  </Button>
                }
              />
            ))
          ) : (
            <ParagraphMedium
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginLeft: $theme.sizing.scale300,
                  }),
                },
              }}
            >
              No airline programs added
            </ParagraphMedium>
          )}
        </Block>
      )}
    </Block>
  );
}
