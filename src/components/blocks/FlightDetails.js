import React, { useState } from "react";

// Base Web
import { Block } from "baseui/block";
import { Notification } from "baseui/notification";
import { Button, KIND, SIZE, SHAPE } from "baseui/button";
import {
  LabelSmall,
  LabelMedium,
  ParagraphXSmall,
  ParagraphSmall,
} from "baseui/typography";
import { useStyletron } from "baseui";

// Primitives
import { Timeline } from "../primitives/timeline";

// Icons
import {
  IconChevronDown,
  IconChevronUp,
  IconLuggage,
  IconBackpack,
} from "@tabler/icons-react";

// Components
import FlightSlice from "./FlightSlice";

// Helpers
import { formatDuration, formatToTime } from "../utils/helpers/dateUtils";

// Expanding Block
function ExpandableBlock({ slice }) {
  // State
  const [isOpen, setIsOpen] = useState(false);

  // Handlers
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Helpers
  function formatToDate(dateTimeString) {
    const dateObj = new Date(dateTimeString);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  }

  function calculateLayover(prevArrivingAt, nextDepartingAt) {
    const arrivalTime = new Date(prevArrivingAt);
    const departureTime = new Date(nextDepartingAt);
    const diffInHours = Math.abs(departureTime - arrivalTime) / 36e5;
    return diffInHours.toFixed(2);
  }

  const numSegments = slice.segments.length;

  function getLastSegmentArrivalDate() {
    const lastSegment = slice.segments[slice.segments.length - 1];
    return formatToDate(lastSegment.arriving_at);
  }

  const lastSegmentArrivalDate = getLastSegmentArrivalDate();
  const isFirstAndLastSegmentOnSameDay =
    slice.segments.length > 1 &&
    formatToDate(slice.segments[0].arriving_at) === lastSegmentArrivalDate;

  const lastSegmentArrivalTime = getLastSegmentArrivalDate();
  const arrivalTime = formatToTime(lastSegmentArrivalTime);

  return (
    <Block>
      <LabelMedium
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginBottom: 0,
              fontWeight: "bold",
            }),
          },
        }}
      >
        Flight{numSegments > 1 ? "s" : ""} to {slice.destination.city_name}
      </LabelMedium>
      <ParagraphXSmall
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale100,
              color: $theme.colors.contentSecondary,
            }),
          },
        }}
      >
        {isFirstAndLastSegmentOnSameDay ? (
          <>
            <strong>Arrives {lastSegmentArrivalDate}</strong> &bull;{" "}
          </>
        ) : (
          ""
        )}
        {numSegments < 2
          ? "Direct"
          : `${numSegments - 1} stop${numSegments - 1 !== 1 ? "s" : ""}`}{" "}
      </ParagraphXSmall>
      <FlightSlice slice={slice} />
      <Block
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              position: "relative",
              marginBottom: isOpen ? "16px" : "0",
            }),
          },
        }}
      >
        {isOpen && (
          <Block>
            {slice.segments.reduce((segmentBlocks, currSegment, index) => {
              // push the current segment details into segmentBlocks
              segmentBlocks.push(
                <Block
                  key={`segment-${index}`}
                  overrides={{
                    Block: {
                      style: ({ $theme }) => ({
                        marginTop: $theme.sizing.scale800,
                      }),
                    },
                  }}
                >
                  <Block>
                    <Block display="flex">
                      <Timeline />
                      <Block>
                        <Block display="flex" alignContent="center">
                          <ParagraphXSmall
                            overrides={{
                              Block: {
                                style: ({ $theme }) => ({
                                  marginTop: "5px",
                                  marginBottom: 0,
                                  minWidth: "50px",
                                }),
                              },
                            }}
                          >
                            {formatToTime(currSegment.departing_at)}
                          </ParagraphXSmall>

                          <ParagraphXSmall
                            overrides={{
                              Block: {
                                style: ({ $theme }) => ({
                                  marginTop: "5px",
                                  marginBottom: 0,
                                }),
                              },
                            }}
                          >
                            {formatToDate(currSegment.departing_at)}
                          </ParagraphXSmall>
                        </Block>

                        <ParagraphXSmall
                          overrides={{
                            Block: {
                              style: ({ $theme }) => ({
                                marginTop: 0,
                                marginBottom: 0,
                              }),
                            },
                          }}
                        >
                          <strong>{currSegment.origin.iata_code}</strong> (
                          {currSegment.origin.name})
                        </ParagraphXSmall>

                        <Block display="flex" alignContent="center">
                          <ParagraphXSmall>
                            {formatDuration(currSegment.duration)}
                          </ParagraphXSmall>

                          <Block
                            as="img"
                            src={currSegment.marketing_carrier.logo_symbol_url}
                            alt="Image"
                            width="20px"
                            height="20px"
                            margin="auto 10px auto 30px"
                          />

                          <ParagraphXSmall>
                            {currSegment.marketing_carrier.iata_code}{" "}
                            {currSegment.marketing_carrier_flight_number}
                          </ParagraphXSmall>
                        </Block>

                        <Block display="flex" alignContent="center">
                          <ParagraphXSmall
                            overrides={{
                              Block: {
                                style: ({ $theme }) => ({
                                  marginTop: "5px",
                                  marginBottom: 0,
                                  minWidth: "50px",
                                }),
                              },
                            }}
                          >
                            {formatToTime(currSegment.arriving_at)}
                          </ParagraphXSmall>

                          <ParagraphXSmall
                            overrides={{
                              Block: {
                                style: ({ $theme }) => ({
                                  marginTop: "5px",
                                  marginBottom: 0,
                                }),
                              },
                            }}
                          >
                            {formatToDate(currSegment.arriving_at)}
                          </ParagraphXSmall>
                        </Block>

                        <ParagraphXSmall
                          overrides={{
                            Block: {
                              style: ({ $theme }) => ({
                                marginTop: 0,
                                marginBottom: 0,
                              }),
                            },
                          }}
                        >
                          <strong>{currSegment.destination.iata_code}</strong> (
                          {currSegment.destination.name})
                        </ParagraphXSmall>
                      </Block>
                    </Block>

                    <ParagraphXSmall
                      overrides={{
                        Block: {
                          style: ({ $theme }) => ({
                            marginBottom: 0,
                          }),
                        },
                      }}
                    >
                      Operated by {currSegment.operating_carrier.name}
                    </ParagraphXSmall>

                    <ParagraphXSmall
                      overrides={{
                        Block: {
                          style: ({ $theme }) => ({
                            marginTop: 0,
                          }),
                        },
                      }}
                    >
                      Aircraft: {currSegment.aircraft.name}
                    </ParagraphXSmall>
                  </Block>
                </Block>
              );

              // If there is a previous segment, calculate the layover time
              function convertToHoursMinutes(time) {
                const hours = Math.floor(time);
                const minutes = Math.floor((time - hours) * 60);
                return `${hours}h ${minutes}m`;
              }

              if (index < slice.segments.length - 1) {
                const nextSegment = slice.segments[index + 1];
                const layoverTime = calculateLayover(
                  currSegment.arriving_at,
                  nextSegment.departing_at
                );
                const formattedLayoverTime = convertToHoursMinutes(layoverTime);
                segmentBlocks.push(
                  <Block key={`layover-${index}`}>
                    <Notification
                      overrides={{
                        Body: {
                          style: ({ $theme }) => ({
                            width: "auto",
                            fontSize: $theme.typography.LabelSmall.fontSize,
                          }),
                        },
                      }}
                    >
                      {parseFloat(formattedLayoverTime) > 4 ? (
                        <strong>{formattedLayoverTime}</strong>
                      ) : (
                        formattedLayoverTime
                      )}{" "}
                      transfer in {currSegment.destination.iata_code}
                    </Notification>
                  </Block>
                );
              }
              return segmentBlocks;
            }, [])}
          </Block>
        )}
        <Block
          onClick={handleClick}
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginBottom: $theme.sizing.scale800,
              }),
            },
          }}
        >
          <Button kind={KIND.tertiary} size={SIZE.mini} shape={SHAPE.circle}>
            {isOpen ? (
              <IconChevronUp size={16} />
            ) : (
              <IconChevronDown size={16} />
            )}
          </Button>
        </Block>
      </Block>
    </Block>
  );
}

export default function FlightDetails({ offer }) {
  // Extract passengers and slices from the offer
  const { passengers, slices } = offer;

  // Function to calculate the total number of checked bags for all passengers
  const getTotalCheckedBags = () => {
    let totalCheckedBags = 0;
    passengers.forEach((passenger) => {
      if (passenger.baggages && passenger.baggages.length > 0) {
        const checkedBaggage = passenger.baggages.find(
          (baggage) => baggage.type === "checked"
        );
        if (checkedBaggage) {
          totalCheckedBags += checkedBaggage.quantity;
        }
      }
    });
    return totalCheckedBags;
  };

  // Function to calculate the total number of cabin bags for all passengers
  const getTotalCabinBags = () => {
    let totalCabinBags = 0;
    passengers.forEach((passenger) => {
      if (passenger.baggages && passenger.baggages.length > 0) {
        const cabinBaggage = passenger.baggages.find(
          (baggage) => baggage.type === "cabin"
        );
        if (cabinBaggage) {
          totalCabinBags += cabinBaggage.quantity;
        }
      }
    });
    return totalCabinBags;
  };

  // Calculate the total checked and cabin bags for all passengers
  const totalCheckedBags = getTotalCheckedBags();
  const totalCabinBags = getTotalCabinBags();
  return (
    <main>
      {offer.slices.map((slice, index) => (
        <ExpandableBlock key={index} slice={slice} />
      ))}
      <LabelMedium>
        <strong>Baggage</strong>
      </LabelMedium>
      <ParagraphXSmall
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale100,
              color: $theme.colors.contentSecondary,
            }),
          },
        }}
      >
        The total baggage included in this fare
      </ParagraphXSmall>
      <div>
        {/*{passengers.map((passenger, index) => (
          <div key={index}>
            <p>
              Passenger {index + 1}:{" "}
              {passenger.baggages ? passenger.baggages.length : 0} bags
            </p>
          </div>
        ))}*/}
        <Block>
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  display: "flex",
                  alignItems: "center",
                  marginBottom: $theme.sizing.scale400,
                }),
              },
            }}
          >
            <Block
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginRight: $theme.sizing.scale400,
                  }),
                },
              }}
            >
              <IconLuggage size={16} />
            </Block>
            <LabelSmall>
              {totalCheckedBags > 0
                ? `${totalCheckedBags} checked bags`
                : "Not included"}
            </LabelSmall>
          </Block>
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  display: "flex",
                  alignItems: "center",
                  marginBottom: $theme.sizing.scale400,
                }),
              },
            }}
          >
            <Block
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginRight: $theme.sizing.scale400,
                  }),
                },
              }}
            >
              <IconBackpack size={16} />
            </Block>
            <LabelSmall>
              {totalCabinBags > 0 ? `${totalCabinBags} cabin bags` : "None"}
            </LabelSmall>
          </Block>
        </Block>
      </div>
    </main>
  );
}
