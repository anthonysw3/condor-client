"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Block } from "baseui/block";
import { Button, KIND, SIZE } from "baseui/button";
import { LabelSmall } from "baseui/typography";
import { ProgressBar } from "baseui/progress-bar";

// Icons
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";

// React Grid System
import { Row, Col } from "react-grid-system";

// Providers
import { useLayer } from "@/contexts/LayerProvider";
import { useFlights } from "@/contexts/FlightsProvider";

import { useSelector, useDispatch } from "react-redux";
import {
  setDurationMax,
  setDurationMin,
} from "../../../components/utils/store/slices/flightSlice";

// Components
import EditBlock from "@/components/blocks/EditBlock";
import FlightResult from "@/components/blocks/FlightResult";
import { FlightResultSkeleton } from "@/components/containers/Skeletons";
import SortingOptions from "@/components/blocks/SortingOptions";
import Searching from "@/components/blocks/Searching";
import Filters from "@/components/blocks/Filters";

import useIntersectionObserver from "@/components/utils/helpers/useIntersectionObserver";

export default function FlightResults() {
  const {
    fetchFlightOffersPage,
    isLoading,
    setIsLoading,
    after,
    hasReceivedFirstPage,
    setHasReceivedFirstPage,
    offersByBest,
    offersByPrice,
    offersByDuration,
    offers,
    fetchAttempts,
    isSimilarOffer,
    searchComplete,
  } = useFlights();

  const {
    origin,
    destination,
    dates: { outbound, inbound },
    travelClass,
    passengers: { adults, children, infants },
  } = useSelector((state) => state.flight);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const didMount = useRef(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const MAX_PAGES = 10;

  const dispatch = useDispatch();

  useEffect(() => {
    // If the current path matches the path of the FlightResults page, reset the isLoading state
    if (pathname === "/flights/results") {
      setIsLoading(true);
      // You can also initiate any other actions here if needed
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    console.log("Effect with dependency [fetchData] is running");
    const fetchData = async () => {
      await fetchFlightOffersPage(null); // Initial fetch without the 'after' value

      if (!hasReceivedFirstPage) {
        setHasReceivedFirstPage(true);
        setIsLoading(false); // Ensure isLoading is set to false here
        console.log("Loading state set to display initial data");
      }
    };

    fetchData();

    setHasFetchedOnce(true);
  }, []); // This useEffect runs only once on mount

  const [searchProgress, setSearchProgress] = useState(10); // Initial value is 10

  useEffect(() => {
    if (hasReceivedFirstPage) {
      setSearchProgress(60); // Set progress to 60% when first page is received
    }
  }, [hasReceivedFirstPage]);

  useEffect(() => {
    if (searchComplete) {
      setSearchProgress(100);
    }
  }, [searchComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSearchProgress((prevProgress) => {
        if (prevProgress < 100) {
          // Ensure progress doesn't exceed 100
          return prevProgress + 5; // Add 5% every 2 seconds
        }
        return prevProgress; // If progress is 100 or more, just return the current value
      });
    }, 2000); // 2 seconds

    return () => clearInterval(interval); // Clean up the interval when component is unmounted or when the effect reruns
  }, []);

  const [sortingMethod, setSortingMethod] = useState("best");

  const sortedOffers =
    sortingMethod === "best"
      ? offersByBest
      : sortingMethod === "price"
      ? offersByPrice
      : offersByDuration || [];

  const totalResults = sortedOffers.length;

  const fetchedAfterValues = useRef(new Set());

  console.log("Initial Offers:", offers.length);

  useEffect(() => {
    console.log("Effect with dependency [fetchFlightOffersPage] is running");
    if (after && !fetchedAfterValues.current.has(after)) {
      fetchFlightOffersPage(after);
      fetchedAfterValues.current.add(after);
    }
  }, [after]);

  const [numItemsDisplayed, setNumItemsDisplayed] = useState(20);

  const parseDuration = (durationString) => {
    let days = 0;
    let hours = 0;
    let minutes = 0;

    const daysMatch = durationString.match(/(\d+)D/);
    const hoursMatch = durationString.match(/(\d+)H/);
    const minutesMatch = durationString.match(/(\d+)M/);

    if (daysMatch) {
      days = parseFloat(daysMatch[1]) * 24; // Convert days to hours
    }

    if (hoursMatch) {
      hours = parseFloat(hoursMatch[1]);
    }

    if (minutesMatch) {
      minutes = parseFloat(minutesMatch[1]) / 60; // Convert minutes to fraction of an hour
    }

    return days + hours + minutes;
  };

  const handleLastItemVisible = () => {
    // Increase the number of items displayed
    setNumItemsDisplayed((prevNumItemsDisplayed) => prevNumItemsDisplayed + 20); // Load 20 more items, adjust as needed
  };

  const lastItemRef = useIntersectionObserver(handleLastItemVisible);

  const { openLayer, closeLayer } = useLayer();

  // Handlers
  const handleFiltersDrawer = () => {
    const title = `Filters`;
    const content = <Filters airlinesAndPrices={airlinesAndPrices} />;

    openLayer(title, content, null);
  };

  // Apply filters
  const filters = useSelector((state) => state.flight.filters);

  const filterByStops = (offers, stopsFilter) => {
    return offers.filter((offer) => {
      // Get the total number of segments across all slices
      const totalSegments = offer.slices.reduce(
        (acc, slice) => acc + slice.segments.length,
        0
      );

      if (stopsFilter.includes(0) && totalSegments === 1) {
        return true;
      } else if (stopsFilter.includes(1) && totalSegments === 2) {
        return true;
      } else if (stopsFilter.includes(2) && totalSegments > 2) {
        return true;
      }
      return false;
    });
  };

  const filterByTime = (offers, originTimeRange, destinationTimeRange) => {
    return offers.filter((offer) => {
      const firstSegment = offer.slices[0].segments[0];
      const lastSlice = offer.slices[offer.slices.length - 1];
      const lastSegment = lastSlice.segments[lastSlice.segments.length - 1];

      // Extract the time in hours (e.g., 16.5 for 16:30)
      const extractTimeInHours = (isoString) => {
        const timePart = isoString.split("T")[1];
        const hour = parseFloat(timePart.split(":")[0]);
        const minutes = parseFloat(timePart.split(":")[1]);
        return hour + minutes / 60;
      };

      const outboundTime = extractTimeInHours(firstSegment.departing_at);
      const returnTime = extractTimeInHours(lastSegment.departing_at);

      const isOutboundTimeValid =
        originTimeRange[0] <= outboundTime &&
        outboundTime <= originTimeRange[1];

      const isReturnTimeValid =
        !destinationTimeRange ||
        (destinationTimeRange[0] <= returnTime &&
          returnTime <= destinationTimeRange[1]);

      return isOutboundTimeValid && isReturnTimeValid;
    });
  };

  const maxOfferDuration = Math.max(
    ...offers.map((offer) =>
      Math.max(...offer.slices.map((slice) => parseDuration(slice.duration)))
    )
  );

  if (offers.length > 0) {
    dispatch(setDurationMax(maxOfferDuration));
  }

  const minOfferDuration = Math.min(
    ...offers.map((offer) =>
      Math.min(...offer.slices.map((slice) => parseDuration(slice.duration)))
    )
  );

  if (offers.length > 0) {
    dispatch(setDurationMin(minOfferDuration));
  }

  const filterBySelectedDuration = (offers, selectedMaxDuration) => {
    if (!selectedMaxDuration) {
      console.warn(
        "selectedMaxDuration is undefined or not provided. No filtering based on duration will occur."
      );
      return offers;
    }

    return offers.filter((offer) => {
      return !offer.slices.some(
        (slice) => parseDuration(slice.duration) > selectedMaxDuration
      );
    });
  };

  const getAirlinesAndMinPrices = (offers) => {
    const airlinesMap = {};

    offers.forEach((offer) => {
      const airlineCode = offer.owner.iata_code;
      const airlineName = offer.owner.name;
      const price = offer.total_amount;

      if (!airlinesMap[airlineCode]) {
        airlinesMap[airlineCode] = { name: airlineName, minPrice: price };
      } else {
        airlinesMap[airlineCode].minPrice = Math.min(
          airlinesMap[airlineCode].minPrice,
          price
        );
      }
    });

    return airlinesMap;
  };

  const airlinesAndPrices = getAirlinesAndMinPrices(offers);

  const applyFilters = (offers, filters) => {
    console.log("applyFilters called with filters:", filters);

    let { selectedDurationMax } = filters;

    // Check if selectedDurationMax is not a number
    if (typeof selectedDurationMax !== "number") {
      console.warn(
        "selectedDurationMax is not a number. Defaulting to max value."
      );
      selectedDurationMax = Infinity; // or any max value you prefer
    }

    // Start with all the offers
    let filteredOffers = offers;

    // Apply the stops filter
    filteredOffers = filterByStops(filteredOffers, filters.stops);

    // Apply the time filter
    filteredOffers = filterByTime(
      filteredOffers,
      filters.originDepartTimeRange,
      filters.destinationDepartTimeRange
    );

    // Apply the selected duration filter
    console.log(
      "About to call filterBySelectedDuration with selectedMaxDuration:",
      selectedDurationMax
    );
    filteredOffers = filterBySelectedDuration(
      filteredOffers,
      selectedDurationMax
    );

    return filteredOffers;
  };

  const filteredOffers = applyFilters(sortedOffers, filters);

  return (
    <main>
      <Row>
        <Col lg={6}>
          <EditBlock
            origin={origin}
            destination={destination}
            outbound={outbound}
            inbound={inbound}
            travelClass={travelClass}
            numAdults={adults}
            numChildren={children}
            numInfants={infants}
          />
          <SortingOptions
            setSortingMethod={setSortingMethod}
            sortingMethod={sortingMethod}
            offersByBest={offersByBest}
            offersByPrice={offersByPrice}
            offersByDuration={offersByDuration}
          />
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: $theme.sizing.scale500,
                  marginLeft: $theme.sizing.scale300,
                  marginRight: $theme.sizing.scale300,
                }),
              },
            }}
          >
            <Block>
              <LabelSmall
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      marginTop: $theme.sizing.scale400,
                    }),
                  },
                }}
              >
                <Searching
                  totalResults={totalResults}
                  searchComplete={searchComplete}
                  searchProgress={searchProgress}
                />
              </LabelSmall>
            </Block>
            <Block>
              <Button
                onClick={handleFiltersDrawer}
                size={SIZE.compact}
                kind={KIND.secondary}
                startEnhancer={<IconAdjustmentsHorizontal size={16} />}
              >
                Filters
              </Button>
            </Block>
          </Block>
          {searchProgress < 100 ? <ProgressBar value={searchProgress} /> : null}
          {isLoading ? (
            <Block>
              <FlightResultSkeleton />
              <FlightResultSkeleton />
              <FlightResultSkeleton />
              <FlightResultSkeleton />
            </Block>
          ) : (
            <Row>
              <Col lg={12}>
                {filteredOffers
                  .slice(0, numItemsDisplayed)
                  .map((offer, index, arr) => (
                    <div
                      ref={index === arr.length - 1 ? lastItemRef : null}
                      key={offer.id}
                    >
                      <FlightResult
                        offer={offer}
                        isSimilarOffer={isSimilarOffer}
                      />
                    </div>
                  ))}
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </main>
  );
}
