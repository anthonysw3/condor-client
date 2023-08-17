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

import { useSelector } from "react-redux";

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
  }, []); // This useEffect runs only once on mount

  const fetchedAfterValues = useRef(new Set());

  useEffect(() => {
    console.log("Effect with dependency [fetchFlightOffersPage] is running");
    if (after && !fetchedAfterValues.current.has(after)) {
      fetchFlightOffersPage(after);
      fetchedAfterValues.current.add(after);
    }
  }, [after]);

  const [sortingMethod, setSortingMethod] = useState("best");

  const [numItemsDisplayed, setNumItemsDisplayed] = useState(20);

  const [searchProgress, setSearchProgress] = useState(10);

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

  const { openLayer, closeLayer } = useLayer();

  // Handlers
  const handleFiltersDrawer = () => {
    const title = `Filters`;
    const content = <Filters />;

    openLayer(title, content, null);
  };

  const totalResults = sortedOffers.length;

  console.log("Offers state in page.js", offers);

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
                <Searching totalResults={totalResults} />
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
          <ProgressBar value={searchProgress} />
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
