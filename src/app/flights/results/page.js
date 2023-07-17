"use client";

import React, { useEffect, useState, useRef } from "react";

import { createClient } from "@sanity/client";

import { Block } from "baseui/block";
import { Button, KIND, SIZE } from "baseui/button";

// Icons
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";

// React Grid System
import { Row, Col } from "react-grid-system";

// Providers
import { useLayer } from "@/contexts/LayerProvider";

// Components
import EditBlock from "@/components/blocks/EditBlock";
import FlightResult from "@/components/blocks/FlightResult";
import { FlightResultSkeleton } from "@/components/containers/Skeletons";
import SortingOptions from "@/components/blocks/SortingOptions";
import SearchingText from "@/components/blocks/SearchingText";
import Filters from "@/components/blocks/Filters";

// Store
import { useSelector } from "react-redux";

// API Fetch
import { fetchFlightOffers } from "../../../services/flights/duffelApi";

import useIntersectionObserver from "@/components/utils/helpers/useIntersectionObserver";

export default function FlightResults() {
  // State
  const [isLoading, setIsLoading] = useState(true); // API loading
  const [after, setAfter] = useState(null); // API pagination
  const [offers, setOffers] = useState([]);

  const [refreshKey, setRefreshKey] = useState(0);

  const [offersByBest, setOffersByBest] = useState([]);
  const [offersByPrice, setOffersByPrice] = useState([]);
  const [offersByDuration, setOffersByDuration] = useState([]);

  // Store
  const {
    origin,
    destination,
    dates: { outbound, inbound },
    travelClass,
    passengers: { adults, children, infants },
  } = useSelector((state) => state.flight);

  const sortByBest = (a, b) => {
    // Calculate min and max for normalization
    const allOffers = [...offers];
    const minPrice = Math.min(...allOffers.map((offer) => offer.total_amount));
    const maxPrice = Math.max(...allOffers.map((offer) => offer.total_amount));
    const minDuration = Math.min(...allOffers.map(calculateDuration));
    const maxDuration = Math.max(...allOffers.map(calculateDuration));
    const minStops = Math.min(...allOffers.map(calculateStops));
    const maxStops = Math.max(...allOffers.map(calculateStops));

    // Calculate score for each offer
    const aScore = calculateScore(
      a,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      minStops,
      maxStops
    );
    const bScore = calculateScore(
      b,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      minStops,
      maxStops
    );

    // Return comparison of scores
    return aScore - bScore;
  };

  const sortByPrice = (a, b) => a.total_amount - b.total_amount;

  const sortByDuration = (a, b) => {
    const calculateTotalDuration = (offer) => {
      let totalDuration = 0;
      offer.slices.forEach((slice) => {
        const departureTime = new Date(slice.segments[0].departing_at);
        const arrivalTime = new Date(
          slice.segments[slice.segments.length - 1].arriving_at
        );
        const duration = (arrivalTime - departureTime) / (1000 * 60); // Duration in minutes
        totalDuration += duration;
      });
      return totalDuration;
    };

    const aTotalDuration = calculateTotalDuration(a);
    const bTotalDuration = calculateTotalDuration(b);

    return aTotalDuration - bTotalDuration;
  };

  function mergeSortedArrays(arr1, arr2, comparisonFunction) {
    const merged = [];
    let index1 = 0;
    let index2 = 0;

    while (index1 < arr1.length && index2 < arr2.length) {
      // Compare elements from arr1 and arr2 and push the smaller one into the merged array
      if (comparisonFunction(arr1[index1], arr2[index2]) < 0) {
        merged.push(arr1[index1]);
        index1++;
      } else {
        merged.push(arr2[index2]);
        index2++;
      }
    }

    // If there are remaining elements in arr1 or arr2, push them into the merged array
    while (index1 < arr1.length) {
      merged.push(arr1[index1]);
      index1++;
    }
    while (index2 < arr2.length) {
      merged.push(arr2[index2]);
      index2++;
    }

    return merged;
  }

  const ref = useRef(null);
  const uniqueFlights = useRef(new Set());

  const fetchFlightOffersPage = async (after) => {
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

      const { results } = flightOffers;
      const newOffers = results.data || [];
      const newAfter = results.meta.after || null;

      const uniqueNewOffers = newOffers.filter((offer) => {
        const flightIdentifier = `${offer.owner.name}-${offer.total_amount}`;

        if (uniqueFlights.current.has(flightIdentifier)) {
          return false;
        }

        uniqueFlights.current.add(flightIdentifier);
        return true;
      });

      const newOffersSortedByBest = [...uniqueNewOffers].sort(sortByBest);
      const newOffersSortedByPrice = [...uniqueNewOffers].sort(sortByPrice);
      const newOffersSortedByDuration = [...uniqueNewOffers].sort(
        sortByDuration
      );

      setOffersByBest((prevOffers) =>
        mergeSortedArrays(prevOffers, newOffersSortedByBest, sortByBest)
      );
      setOffersByPrice((prevOffers) =>
        mergeSortedArrays(prevOffers, newOffersSortedByPrice, sortByPrice)
      );
      setOffersByDuration((prevOffers) =>
        mergeSortedArrays(prevOffers, newOffersSortedByDuration, sortByDuration)
      );

      setOffers((prevOffers) => [...prevOffers, ...uniqueNewOffers]);
      setAfter(newAfter);

      if (!newAfter && !hasReceivedFirstPage) {
        setHasReceivedFirstPage(true); // Set flag indicating the first page has been received
        setIsLoading(false); // Set isLoading to false when first page arrives
        console.log("Loading state set to false");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Initialize the flag
  const [hasReceivedFirstPage, setHasReceivedFirstPage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch the initial page of flight offers
      await fetchFlightOffersPage(after);

      if (!after && !hasReceivedFirstPage) {
        setIsLoading(false); // Set isLoading to false when first page arrives
        console.log("Loading state set to false");
      }
    };

    fetchData();
  }, []); // Run only once on component mount

  useEffect(() => {
    if (after) {
      fetchFlightOffersPage(after); // Fetch the next page when "after" changes
    }
  }, [after]);

  const client = createClient({
    projectId: "6d2pzg6a",
    dataset: "production",
    useCdn: true,
  });

  const [airlineCount, setAirlineCount] = useState(null);

  const fetchAirlineCount = async () => {
    try {
      const response = await client.fetch('*[_type == "airline"]');
      const count = response.length;
      setAirlineCount(count);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAirlineCount();
  }, []);

  useEffect(() => {
    fetchAirlineCount();
  }, []);

  const [sortingMethod, setSortingMethod] = useState("best");

  const totalPassengers = adults + children + infants;

  const [numItemsDisplayed, setNumItemsDisplayed] = useState(20);

  const sortedOffers =
    sortingMethod === "best"
      ? offersByBest
      : sortingMethod === "price"
      ? offersByPrice
      : offersByDuration;

  const handleLastItemVisible = () => {
    // Increase the number of items displayed
    setNumItemsDisplayed((prevNumItemsDisplayed) => prevNumItemsDisplayed + 20); // Load 20 more items, adjust as needed
  };

  const lastItemRef = useIntersectionObserver(handleLastItemVisible);

  /////////// ALGORITHM

  // Helper functions
  const calculateDuration = (offer) => {
    let totalDuration = 0;
    offer.slices.forEach((slice) => {
      const departureTime = new Date(slice.segments[0].departing_at);
      const arrivalTime = new Date(
        slice.segments[slice.segments.length - 1].arriving_at
      );
      const duration = (arrivalTime - departureTime) / (1000 * 60); // Duration in minutes
      totalDuration += duration;
    });
    return totalDuration;
  };

  const calculateStops = (offer) => {
    let totalStops = 0;
    offer.slices.forEach((slice) => {
      totalStops += slice.segments ? slice.segments.length : 0;
    });
    return totalStops;
  };

  const calculateScore = (
    offer,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    minStops,
    maxStops
  ) => {
    // Normalize values
    const normalizedPrice =
      (offer.total_amount - minPrice) / (maxPrice - minPrice);
    const normalizedDuration =
      (calculateDuration(offer) - minDuration) / (maxDuration - minDuration);
    const normalizedStops =
      (calculateStops(offer) - minStops) / (maxStops - minStops);

    // Calculate score
    return (
      0.5 * normalizedPrice + 0.3 * normalizedDuration + 0.2 * normalizedStops
    );
  };

  //////////// ALGORITHM

  const totalResults = offers.length;

  const { openLayer, closeLayer } = useLayer();

  // Handlers
  const handleFiltersDrawer = () => {
    const title = `Filters`;
    const content = <Filters />;

    openLayer(title, content, null);
  };

  const refreshFlightOffers = async () => {
    setIsLoading(true);
    await fetchFlightOffersPage(after);
  };

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
            adults={adults}
            children={children}
            infants={infants}
            refreshFlightOffers={refreshFlightOffers}
          />
          <SortingOptions
            setSortingMethod={setSortingMethod}
            sortingMethod={sortingMethod}
            offersByBest={offersByBest}
            offersByPrice={offersByPrice}
            offersByDuration={offersByDuration}
            totalPassengers={totalPassengers}
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
              <SearchingText
                totalResults={totalResults}
                airlines={airlineCount}
              />
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
                {sortedOffers
                  .slice(0, numItemsDisplayed)
                  .map((offer, index, arr) => (
                    <div
                      ref={index === arr.length - 1 ? lastItemRef : null}
                      key={offer.id}
                    >
                      <FlightResult offer={offer} />
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
