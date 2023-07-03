import React from "react";

// Base Web
import { Block } from "baseui/block";
import { ParagraphXSmall } from "baseui/typography";
import { Notification } from "baseui/notification";

// Components
import { Timeline } from "../primitives/timeline";

// Helpers
import { formatDuration, formatToTime } from "../utils/helpers/dateUtils";

export default function FlightStep({ slice }) {
  function formatToDate(dateTimeString) {
    const dateObj = new Date(dateTimeString);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  }

  return (
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
                      {currSegment.marketing_carrier_flight_number} &bull;{" "}
                      {currSegment.passengers[0].cabin_class === "economy"
                        ? "Economy"
                        : currSegment.passengers[0].cabin_class ===
                          "premium_economy"
                        ? "Premium economy"
                        : currSegment.passengers[0].cabin_class === "business"
                        ? "Business class"
                        : currSegment.passengers[0].cabin_class === "first"
                        ? "First class"
                        : null}
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
  );
}
