"use client";

import React, { useEffect, useState } from "react";

// Base Web
import { Grid, Cell } from "baseui/layout-grid";
import { Block } from "baseui/block";
import {
  HeadingXSmall,
  LabelSmall,
  LabelMedium,
  LabelLarge,
  ParagraphXSmall,
} from "baseui/typography";
import { ButtonGroup } from "baseui/button-group";
import { Button, KIND, SIZE } from "baseui/button";
import { useStyletron } from "baseui";

// Primitives
import { Card } from "@/components/primitives/card";

// React Grid System
import { Container, Row, Col } from "react-grid-system";

// Components
import FlightResult from "@/components/blocks/FlightResult";
import FlightSearch from "@/components/blocks/FlightSearch";
import Calendar, { CalendarFooter } from "@/components/blocks/Calendar";
import Passengers from "@/components/blocks/Passengers";
import { FlightResultSkeleton } from "@/components/containers/Skeletons";

// Icons
import {
  IconArrowRight,
  IconChevronDown,
  IconArrowsDiff,
  IconEdit,
} from "@tabler/icons-react";

// Providers
import { useCondor } from "../../../components/utils/providers/CondorProvider";

// Store
import { useSelector } from "react-redux";

// Helpers
import { getTotalDuration } from "../../../components/utils/helpers/flightUtils";
import { formatDatetoDateMonth } from "../../../components/utils/helpers/dateUtils";

// API Fetch
import { fetchFlightOffers } from "../../../services/flights/duffelApi";

// Sorting and filtering
import { orderBy } from "lodash";

function getDurationInMinutes(duration) {
  const regex = /P(\d+D)?T?(\d+H)?(\d+M)?/;
  const match = duration.match(regex);

  if (match) {
    let [, days, hours, minutes] = match;

    days = days ? Number(days.slice(0, -1)) : 0;
    hours = hours ? Number(hours.slice(0, -1)) : 0;
    minutes = minutes ? Number(minutes.slice(0, -1)) : 0;

    return days * 24 * 60 + hours * 60 + minutes;
  } else {
    console.log(
      "No match found for regex in the provided duration: ",
      duration
    );
    return 0;
  }
}

export default function FlightResults() {
  // Style
  const [css, theme] = useStyletron();

  // Provider Functions
  const { openModal, closeModal } = useCondor();

  // State
  const [isLoading, setIsLoading] = useState(true); // API loading
  const [after, setAfter] = useState(null); // API pagination
  const [data, setData] = useState([]); // API response

  // Store
  const {
    origin,
    destination,
    dates: { outbound, inbound },
    travelClass,
    passengers: { adults, children, infants },
  } = useSelector((state) => state.flight);

  // Fetch Flight Offers
  const getFlightOffers = async () => {
    try {
      const flightOffers = await fetchFlightOffers({
        origin,
        destination,
        outbound,
        inbound,
        travelClass,
        adults,
        children,
        infants,
        after,
      });
      const offers = flightOffers.offersResponse?.data || [];
      const newAfter = flightOffers.offersResponse?.meta?.after || null;

      setData((prevData) => [...prevData, ...offers]);
      setAfter(newAfter);

      console.log(JSON.stringify(offers, null, 2));

      if (!newAfter) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getFlightOffers();
  }, [
    origin,
    destination,
    outbound,
    inbound,
    travelClass,
    adults,
    children,
    infants,
  ]);

  useEffect(() => {
    if (after) {
      getFlightOffers();
    }
  }, [after]);

  const refreshFlightOffers = async () => {
    setIsLoading(true);
    await getFlightOffers();
  };

  // Sort Data
  // Sort Data
  const filteredData = data
    .filter((offer) => offer.owner.iata_code !== "ZZ") // Filter out results from owner with iata_code ZZ
    .filter((offer, index, array) => {
      const lowestPrice = array[0].total_amount; // Get the lowest price
      const maxPrice = lowestPrice * 5; // Calculate the maximum allowed price (500% of the lowest price)
      return offer.total_amount <= maxPrice; // Filter out offers with price exceeding the maximum
    });

  // Determine the Cheapest and Fastest
  const sortedByPrice = [...filteredData].sort(
    (a, b) => a.total_amount - b.total_amount
  );
  const sortedByDuration = [...filteredData].sort(
    (a, b) => getTotalDuration(a.slices) - getTotalDuration(b.slices)
  );

  // Determine the Cheapest and Fastest
  const cheapest = orderBy(data, "total_amount")[0];
  const fastest = orderBy(data, (offer) => getTotalDuration(offer.slices))[0];

  // Handlers
  const handleEditDrawer = () => {
    const title = `Edit your trip`;
    const content = <FlightSearch />;

    openModal(title, content);
  };

  const handleCalendarDrawer = () => {
    const title = "Choose your dates";
    const callbacks = {
      onChange: (selectedDates) => {
        dispatch(setDates(selectedDates));
        closeModal();
      },
    };
    const content = <Calendar onChange={callbacks.onChange} />;
    const footer = <CalendarFooter />;

    openModal(title, content, footer, callbacks);
  };

  const handlePassengerDrawer = () => {
    const title = "Who's travelling?";
    const callbacks = {
      onClose: async () => {
        closeModal();
        await refreshFlightOffers();
      },
    };
    const content = <Passengers onChange={callbacks.onChange} />;

    openModal(title, content, null, callbacks);
  };

  return (
    <main>
      <Container style={{ padding: 0 }}>
        <Row>
          <Col lg={7}>
            <Block
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    display: "flex",
                    alignItems: "center",
                  }),
                },
              }}
            >
              <HeadingXSmall
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      display: "flex",
                      alignItems: "center",
                      marginTop: 0,
                      marginBottom: 0,
                      marginLeft: $theme.sizing.scale200,
                    }),
                  },
                }}
              >
                {origin.name}
                <Block
                  overrides={{
                    Block: {
                      style: ({ $theme }) => ({
                        marginLeft: $theme.sizing.scale300,
                        marginRight: $theme.sizing.scale300,
                        display: "flex",
                        alignItems: "center",
                      }),
                    },
                  }}
                >
                  {destination ? (
                    <IconArrowsDiff size={20} />
                  ) : (
                    <IconArrowRight size={20} />
                  )}
                </Block>
                {destination.name}
              </HeadingXSmall>
              <Block
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      marginLeft: $theme.sizing.scale300,
                    }),
                  },
                }}
              >
                <IconEdit
                  size={20}
                  color={theme.colors.primary500}
                  onClick={handleEditDrawer}
                />
              </Block>
            </Block>
            <Block
              size={SIZE.compact}
              kind={KIND.secondary}
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    display: "flex",
                    overflowX: "scroll",
                    flexWrap: "nowrap",
                    marginTop: $theme.sizing.scale200,
                    marginLeft: `-${$theme.sizing.scale600}`,
                    marginRight: `-${$theme.sizing.scale600}`,
                    paddingLeft: $theme.sizing.scale700,
                    paddingRight: $theme.sizing.scale600,
                    WebkitOverflowScrolling: "touch",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    // Hide scrollbar on Windows devices
                    "@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)":
                      {
                        "&::-webkit-scrollbar": {
                          display: "none",
                        },
                        "-ms-overflow-style": "none",
                        scrollbarWidth: "none",
                      },
                  }),
                },
              }}
            >
              <Button
                size={SIZE.compact}
                kind={KIND.secondary}
                endEnhancer={() => <IconChevronDown size={16} />}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      flex: "0 0 auto",
                      whiteSpace: "nowrap",
                      border: `1px solid ${$theme.colors.primary200}`,
                      marginRight: $theme.sizing.scale200,
                    }),
                  },
                }}
                onClick={handleCalendarDrawer}
              >{`${formatDatetoDateMonth(outbound)}${
                inbound ? ` - ${formatDatetoDateMonth(inbound)}` : ""
              }`}</Button>
              <Button
                size={SIZE.compact}
                kind={KIND.secondary}
                endEnhancer={() => <IconChevronDown size={16} />}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      flex: "0 0 auto",
                      whiteSpace: "nowrap",
                      border: `1px solid ${$theme.colors.primary200}`,
                      marginRight: $theme.sizing.scale200,
                    }),
                  },
                }}
                onClick={handlePassengerDrawer}
              >{`${adults + children + infants} passenger${
                adults + children + infants > 1 ? "s" : ""
              }`}</Button>
              <Button
                size={SIZE.compact}
                kind={KIND.secondary}
                endEnhancer={() => <IconChevronDown size={16} />}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      flex: "0 0 auto",
                      whiteSpace: "nowrap",
                      border: `1px solid ${$theme.colors.primary200}`,
                      marginRight: $theme.sizing.scale200,
                    }),
                  },
                }}
              >
                {travelClass}
              </Button>
            </Block>
            {/*<Button size={SIZE.mini} onClick={sortByCheapest}>
        Sort by Cheapest
      </Button>
      <Button size={SIZE.mini} onClick={sortByFastest}>
        Sort by Fastest
        </Button>*/}
            <Card padding={`${theme.sizing.scale200}`}>
              <ButtonGroup
                kind={KIND.tertiary}
                overrides={{
                  Root: {
                    style: ({ $theme }) => ({
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }),
                  },
                }}
              >
                <Button
                  active
                  overrides={{
                    ButtonBase: {
                      style: ({ $theme }) => ({
                        borderBottom: `1px solid ${$theme.colors.primary500}`,
                        width: "calc(100% / 3)",
                      }),
                    },
                  }}
                >
                  <Block
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                  >
                    <LabelSmall
                      overrides={{
                        Block: {
                          style: ({ $theme }) => ({
                            fontWeight: "bold",
                          }),
                        },
                      }}
                    >
                      Best
                    </LabelSmall>
                    <ParagraphXSmall
                      overrides={{
                        Block: {
                          style: ({ $theme }) => ({
                            marginTop: $theme.sizing.scale100,
                            marginBottom: 0,
                          }),
                        },
                      }}
                    ></ParagraphXSmall>
                  </Block>
                </Button>
                <Button
                  overrides={{
                    ButtonBase: {
                      style: ({ $theme }) => ({
                        borderBottom: `1px solid ${$theme.colors.primary500}`,
                        width: "calc(100% / 3)",
                      }),
                    },
                  }}
                >
                  <Block
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                  >
                    <LabelSmall
                      overrides={{
                        Block: {
                          style: ({ $theme }) => ({
                            fontWeight: "bold",
                          }),
                        },
                      }}
                    >
                      Lowest fare
                    </LabelSmall>
                    <ParagraphXSmall
                      overrides={{
                        Block: {
                          style: ({ $theme }) => ({
                            marginTop: $theme.sizing.scale100,
                            marginBottom: 0,
                          }),
                        },
                      }}
                    ></ParagraphXSmall>
                  </Block>
                </Button>
                <Button
                  overrides={{
                    ButtonBase: {
                      style: ({ $theme }) => ({
                        borderBottom: `1px solid ${$theme.colors.primary500}`,
                        width: "calc(100% / 3)",
                      }),
                    },
                  }}
                >
                  <Block
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                  >
                    <LabelSmall
                      overrides={{
                        Block: {
                          style: ({ $theme }) => ({
                            fontWeight: "bold",
                          }),
                        },
                      }}
                    >
                      Fastest
                    </LabelSmall>
                    <ParagraphXSmall
                      overrides={{
                        Block: {
                          style: ({ $theme }) => ({
                            marginTop: $theme.sizing.scale100,
                            marginBottom: 0,
                          }),
                        },
                      }}
                    ></ParagraphXSmall>
                  </Block>
                </Button>
              </ButtonGroup>
            </Card>
            {isLoading && (
              <Block>
                <FlightResultSkeleton />
                <FlightResultSkeleton />
                <FlightResultSkeleton />
                <FlightResultSkeleton />
              </Block>
            )}
            {data.map((offer, index) => (
              <FlightResult
                key={index}
                offer={offer}
                cheapest={offer === cheapest}
                fastest={offer === fastest}
              />
            ))}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
