import React, { useState } from "react";
import { Block } from "baseui/block";
import { Notification } from "baseui/notification";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { Button, KIND, SIZE } from "baseui/button";
import {
  MonoLabelSmall,
  ParagraphMedium,
  ParagraphSmall,
  LabelSmall,
  ParagraphXSmall,
} from "baseui/typography";
import { useStyletron } from "baseui";

// Condor Components
import Steps from "../elements/global/Steps";

// Icons
import {
  IconChevronDown,
  IconChevronUp,
  IconPlane,
  IconMoonFilled,
  IconWifi,
  IconArmchair,
  IconPlug,
  IconDeviceTv,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import FlightSlice from "./FlightSlice";
import { Label } from "baseui/form-control/styled-components";

function ExpandableBlock({ slice }) {
  const [isOpen, setIsOpen] = useState(false);
  const [css, theme] = useStyletron();

  const containerStyle = css({
    position: "relative",
    marginBottom: isOpen ? "16px" : "0",
  });

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  function formatDuration(isoDuration) {
    const matches = isoDuration.match(/P(\d+D)?T?(\d+H)?(\d+M)?/);

    if (!matches) {
      throw new Error(`Invalid duration format: ${isoDuration}`);
    }

    let days = 0;
    let hours = 0;
    let minutes = 0;

    if (matches[1]) {
      days = parseInt(matches[1]);
    }

    if (matches[2]) {
      hours = parseInt(matches[2]);
    }

    if (matches[3]) {
      minutes = parseInt(matches[3]);
    }

    // Convert days to hours
    hours += days * 24;

    return `${hours}h ${minutes}m`;
  }

  function formatToTime(dateTimeString) {
    const dateObj = new Date(dateTimeString);
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function formatToDate(dateTimeString) {
    const dateObj = new Date(dateTimeString);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${day} ${month} ${year}`;
  }

  function calculateLayover(prevArrivingAt, nextDepartingAt) {
    const arrivalTime = new Date(prevArrivingAt);
    const departureTime = new Date(nextDepartingAt);
    const diffInHours = Math.abs(departureTime - arrivalTime) / 36e5;
    return diffInHours.toFixed(2);
  }

  return (
    <Block>
      <FlightSlice slice={slice} />
      <Block className={containerStyle}>
        {isOpen && (
          <Block>
            {slice.segments.reduce((segmentBlocks, currSegment, index) => {
              // push the current segment details into segmentBlocks
              segmentBlocks.push(
                <Block key={`segment-${index}`}>
                  <Block>
                    <Block display="flex">
                      <Steps />
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
                        Body: { style: { width: "auto" } },
                      }}
                    >
                      {formattedLayoverTime}
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
                padding: `${$theme.sizing.scale700}`,
                borderRadius: $theme.borders.radius500,
              }),
            },
          }}
        >
          {isOpen ? <IconChevronUp size={24} /> : <IconChevronDown size={24} />}
        </Block>
      </Block>
    </Block>
  );
}

export default function FlightDetails({ offer }) {
  return (
    <>
      {offer.slices.map((slice, index) => (
        <ExpandableBlock key={index} slice={slice} />
      ))}
    </>
  );
}
