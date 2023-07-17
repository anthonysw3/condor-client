"use client";

import React, { useEffect, useState } from "react";

import { createClient } from "@sanity/client";

import { Block } from "baseui/block";
import { Button, KIND, SIZE } from "baseui/button";

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
import SearchingText from "@/components/blocks/SearchingText";
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
  } = useFlights();

  const {
    origin,
    destination,
    dates: { outbound, inbound },
    travelClass,
    passengers: { adults, children, infants },
  } = useSelector((state) => state.flight);

  useEffect(() => {
    const fetchData = async () => {
      await fetchFlightOffersPage(after);

      if (!after && !hasReceivedFirstPage) {
        setHasReceivedFirstPage(true);
        setIsLoading(false);
        console.log("Loading state set to false");
      }
    };

    fetchData();
  }, [
    after,
    fetchFlightOffersPage,
    hasReceivedFirstPage,
    setHasReceivedFirstPage,
  ]);

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

  const totalResults = offers?.length;

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
                totalResults={totalResults ? totalResults : null}
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
