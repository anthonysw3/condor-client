import React, { useState, useEffect, useRef } from "react";

// Base Web
import { Block } from "baseui/block";
import { Button, SIZE, SHAPE, KIND } from "baseui/button";
import { LabelLarge, LabelSmall } from "baseui/typography";

// Components
import { InputText } from "../primitives/input";
import { List } from "../primitives/list";
import { Modal } from "baseui/modal";

// Sanity
import { urlFor } from "../../services/global/imageUrlBuilder";

const Status = ({ onChange, isOpen, mode }) => {
  const [airlineSearch, setAirlineSearch] = useState("");
  const [filteredAirlines, setFilteredAirlines] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const inputRef = useRef(null);

  const [selectedAirline, setSelectedAirline] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTiers, setSelectedTiers] = useState([]);

  const openModalWithTiers = (tiers) => {
    setSelectedTiers(tiers);
    setIsModalOpen(true);
  };

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
                    onClick={() => {
                      setSelectedAirline(airline);
                      setIsModalOpen(true);
                    }}
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
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale600,
              }),
            },
          }}
        >
          {selectedPrograms.map((program, index) => (
            <List
              key={program.iata_code}
              label={program.airlineName}
              description={program.programName + ": " + program.tierName}
              icon={
                <Block
                  as="img"
                  src={
                    program.logoSymbol?.asset
                      ? urlFor(program.logoSymbol).width(28).url()
                      : null
                  }
                  height="32px"
                  width="32px"
                  alt=""
                />
              }
              listEnd={
                <Button
                  onClick={() => {
                    const newSelectedPrograms = [...selectedPrograms];
                    newSelectedPrograms.splice(index, 1);
                    setSelectedPrograms(newSelectedPrograms);
                  }}
                  size={SIZE.mini}
                  shape={SHAPE.pill}
                  kind={KIND.secondary}
                >
                  Delete
                </Button>
              }
            />
          ))}
        </Block>
      )}
      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false); // Close the modal
            setSelectedAirline(null); // Reset the selected airline
          }}
          isOpen={isModalOpen}
          overrides={{
            Root: {
              style: {
                zIndex: 2000, // Adjust this value as needed
              },
            },
          }}
        >
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  padding: $theme.sizing.scale600,
                }),
              },
            }}
          >
            <LabelLarge>
              {selectedAirline?.frequent_flyer_program.program_name}
            </LabelLarge>
            <LabelSmall
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginTop: $theme.sizing.scale100,
                    color: $theme.colors.primary500,
                  }),
                },
              }}
            >
              {selectedAirline?.name}
            </LabelSmall>
            <Block
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginTop: $theme.sizing.scale600,
                  }),
                },
              }}
            >
              {selectedAirline?.frequent_flyer_program.tiers.map(
                (tier, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      const newProgram = {
                        airlineName: selectedAirline.name,
                        programName:
                          selectedAirline.frequent_flyer_program.program_name,
                        tierName: tier.tier_name,
                        logoSymbol: selectedAirline.logo_symbol,
                      };
                      setSelectedPrograms([...selectedPrograms, newProgram]);

                      // Close the modal
                      setIsModalOpen(false);

                      // Clear the input
                      setAirlineSearch("");
                    }}
                    size={SIZE.default} // Standard size
                    kind={KIND.secondary}
                    overrides={{
                      BaseButton: {
                        style: ({ $theme }) => ({
                          width: "100%", // Full width
                          marginBottom: $theme.sizing.scale300, // Spacing between buttons
                        }),
                      },
                    }}
                  >
                    {tier.tier_name}
                  </Button>
                )
              )}
            </Block>
          </Block>
        </Modal>
      )}
    </Block>
  );
};

export default Status;
