"use client";

import React, { useEffect, useState, useMemo } from "react";

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

export default function FlightResults() {
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

  // Sorted states
  const sortedByBest = useMemo(() => {
    return [...offers].sort((a, b) => {
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
    });
  }, [offers]);

  const sortedByPrice = useMemo(() => {
    return [...offers].sort((a, b) => a.total_amount - b.total_amount);
  }, [offers]);

  const sortedByDuration = useMemo(() => {
    return [...offers].sort((a, b) => {
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
    });
  }, [offers]);

  const [sortingMethod, setSortingMethod] = useState("best");

  // Sorted offers based on sorting method
  const sortedOffers = useMemo(() => {
    switch (sortingMethod) {
      case "best":
        return sortedByBest;
      case "price":
        return sortedByPrice;
      case "duration":
        return sortedByDuration;
      default:
        return offers;
    }
  }, [sortingMethod, sortedByBest, sortedByPrice, sortedByDuration]);

  const firstBestOffer = sortedByBest[0];
  const firstCheapestOffer = sortedByPrice[0];
  const firstFastestOffer = sortedByDuration[0];

  const totalPassengers = adults + children + infants;

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
            firstBestOffer={firstBestOffer}
            firstCheapestOffer={firstCheapestOffer}
            firstFastestOffer={firstFastestOffer}
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
                {sortedOffers.map((offer, index) => (
                  <FlightResult key={index} offer={offer} />
                ))}
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </main>
  );
}
