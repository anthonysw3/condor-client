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
  ParagraphMedium,
} from "baseui/typography";
import { Button, KIND, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";
import { useStyletron } from "baseui";

// React Grid System
import { Container, Row, Col } from "react-grid-system";

// Framer Motion
import { motion, AnimatePresence } from "framer-motion";

// Components
import FlightResult from "@/components/blocks/FlightResult";
import SortTabs from "@/components/blocks/SortTabs";
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
  InfoCircle,
  IconInfoCircle,
} from "@tabler/icons-react";

// Providers
import { useCondor } from "../../../components/utils/providers/CondorProvider";

// Store
import { useSelector } from "react-redux";

// Helpers
import { getTotalDuration } from "../../../components/utils/helpers/flightUtils";
import {
  formatDatetoDateMonth,
  formatDuration,
} from "../../../components/utils/helpers/dateUtils";
import { getCurrencySymbol } from "@/components/utils/helpers/currencyUtils";

// API Fetch
import { fetchFlightOffers } from "../../../services/flights/duffelApi";

// Sorting and filtering
// Convert duration string to minutes
function getDurationInMinutes(duration) {
  const regex = /P(?:([0-9]+)D)?T(?:([0-9]+)H)?(?:([0-9]+)M)?/;
  const match = duration.match(regex);

  if (match) {
    const days = match[1] ? Number(match[1]) : 0;
    const hours = match[2] ? Number(match[2]) : 0;
    const minutes = match[3] ? Number(match[3]) : 0;

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
  const [filteredData, setFilteredData] = useState([]);

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

      console.log(offers);

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

  const [sortBy, setSortBy] = useState("best");
  const [sortedData, setSortedData] = useState([]);
  const [isSorting, setIsSorting] = useState(false);

  // Processing Data
  useEffect(() => {
    const processedData = data.filter(
      (offer) => offer.owner.iata_code !== "PL"
    );
    setFilteredData(processedData);
    console.log("Filtered Data: ", processedData);
  }, [data]);

  useEffect(() => {
    setIsSorting(true);

    // Calculate 4x the cheapest fare in the filteredData
    const fourTimesLowestFare =
      Math.min(...filteredData.map((offer) => offer.total_amount)) * 4;

    let sortedData = filteredData.filter(
      (offer) => offer.total_amount <= fourTimesLowestFare
    );

    if (sortBy === "best") {
      sortedData = sortedData.sort((a, b) => {
        const stopsA = a.slices.reduce(
          (acc, val) => acc + val.segments.length,
          0
        );
        const stopsB = b.slices.reduce(
          (acc, val) => acc + val.segments.length,
          0
        );

        if (stopsA !== stopsB) {
          return stopsA - stopsB;
        } else {
          return a.total_amount - b.total_amount;
        }
      });
    } else if (sortBy === "lowestFare") {
      sortedData = sortedData.sort((a, b) => {
        if (a.total_amount !== b.total_amount) {
          return a.total_amount - b.total_amount;
        } else {
          const durationA = a.slices.reduce(
            (acc, val) => acc + getDurationInMinutes(val.duration),
            0
          );
          const durationB = b.slices.reduce(
            (acc, val) => acc + getDurationInMinutes(val.duration),
            0
          );
          return durationA - durationB;
        }
      });
    } else if (sortBy === "fastest") {
      sortedData = sortedData.sort((a, b) => {
        const durationA = a.slices.reduce(
          (acc, val) => acc + getDurationInMinutes(val.duration),
          0
        );
        const durationB = b.slices.reduce(
          (acc, val) => acc + getDurationInMinutes(val.duration),
          0
        );

        if (durationA !== durationB) {
          return durationA - durationB;
        } else {
          return a.total_amount - b.total_amount;
        }
      });
    }

    setSortedData(sortedData);
    setIsSorting(false);
  }, [sortBy, filteredData]);

  // Update this in your button click handlers
  const handleSortBy = (value) => {
    setIsSorting(true);
    setSortBy(value);
  };

  // Use `sortedData` instead of `filteredData` to render your list

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
                kind={KIND.tertiary}
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
                kind={KIND.tertiary}
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
                kind={KIND.tertiary}
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
            <SortTabs
              sortBy={sortBy}
              isLoading={isLoading}
              isSorting={isSorting}
              sortedData={sortedData}
              handleSortBy={handleSortBy}
            />
            {isLoading && (
              <Block>
                <FlightResultSkeleton />
                <FlightResultSkeleton />
                <FlightResultSkeleton />
                <FlightResultSkeleton />
              </Block>
            )}
            {isSorting ? (
              <Block>
                <FlightResultSkeleton />
                <FlightResultSkeleton />
                <FlightResultSkeleton />
                <FlightResultSkeleton />
              </Block>
            ) : (
              <AnimatePresence>
                {sortedData.map((offer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }} // Initial animation state
                    animate={{ opacity: 1, y: 0 }} // Animation when appearing
                    exit={{ opacity: 0, y: 20 }} // Animation when exiting
                    transition={{ duration: 0.4, delay: index * 0.2 }} // Animation duration and delay
                  >
                    <FlightResult key={index} offer={offer} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
