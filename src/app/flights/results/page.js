"use client";

import React, { useEffect, useState, useRef } from "react";

import { Block } from "baseui/block";

// React Grid System
import { Row, Col } from "react-grid-system";

// Components
import EditBlock from "@/components/blocks/EditBlock";
import FlightResult from "@/components/blocks/FlightResult";
import { FlightResultSkeleton } from "@/components/containers/Skeletons";
import SortingOptions from "@/components/blocks/SortingOptions";

// Store
import { useSelector } from "react-redux";

// API Fetch
import { fetchFlightOffers } from "../../../services/flights/duffelApi";

import useIntersectionObserver from "@/components/utils/helpers/useIntersectionObserver";

export default function FlightResults() {
  const ref = (useRef < HTMLDivElement) | (null > null);
  // State
  const [isLoading, setIsLoading] = useState(true); // API loading
  const [after, setAfter] = useState(null); // API pagination
  const [offers, setOffers] = useState([]);

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
    // If the offer's slice has no segments, default to 0 stops
    const aStops = a.slices.reduce(
      (acc, slice) => acc + (slice.segments ? slice.segments.length : 0),
      0
    );
    const bStops = b.slices.reduce(
      (acc, slice) => acc + (slice.segments ? slice.segments.length : 0),
      0
    );

    return aStops - bStops;
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
      console.log("After:", newAfter);
      console.log("Offers:", newOffers);

      const newOffersSortedByBest = [...newOffers].sort(sortByBest);
      const newOffersSortedByPrice = [...newOffers].sort(sortByPrice);
      const newOffersSortedByDuration = [...newOffers].sort(sortByDuration);

      setOffersByBest((prevOffers) =>
        mergeSortedArrays(prevOffers, newOffersSortedByBest, sortByBest)
      );
      setOffersByPrice((prevOffers) =>
        mergeSortedArrays(prevOffers, newOffersSortedByPrice, sortByPrice)
      );
      setOffersByDuration((prevOffers) =>
        mergeSortedArrays(prevOffers, newOffersSortedByDuration, sortByDuration)
      );

      setOffers((prevOffers) => [...prevOffers, ...newOffers]);
      setAfter((prevAfter) => newAfter);

      if (!newAfter && !hasReceivedFirstPage) {
        setHasReceivedFirstPage(true); // Set flag indicating the first page has been received
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
          />
          <SortingOptions
            setSortingMethod={setSortingMethod}
            sortingMethod={sortingMethod}
            offersByBest={offersByBest}
            offersByPrice={offersByPrice}
            offersByDuration={offersByDuration}
            totalPassengers={totalPassengers}
          />
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
