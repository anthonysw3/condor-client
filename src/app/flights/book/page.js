"use client";

import React, { useEffect, useState } from "react";

// Base Web
import { Block } from "baseui/block";
import { HeadingXSmall, LabelMedium, ParagraphXSmall } from "baseui/typography";
import { Skeleton } from "baseui/skeleton";

// React Grid System
import { Container, Row, Col } from "react-grid-system";

// Primitives
import { Card } from "../../../components/primitives/card.js";

// Components
import { FlightSummarySkeleton } from "../../../components/containers/Skeletons.js";

// Icons
import { IconArrowRight, IconArrowsDiff } from "@tabler/icons-react";

// Store
import { useSelector } from "react-redux";

// API Fetch
import { fetchSingleFlightOffer } from "../../../services/flights/duffelApi";
import FlightStep from "@/components/blocks/FlightStep.js";

export default function FlightBooking() {
  const [offer, setOffer] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const offerId = useSelector((state) => state.flightOffer.id); // <-- Use id instead of offerId

  useEffect(() => {
    const getSingleOffer = async () => {
      setIsLoading(true);
      if (offerId) {
        //only fetch if offerId is not null
        try {
          const singleOffer = await fetchSingleFlightOffer(offerId);
          setOffer(singleOffer);
          setIsLoading(false);
          console.log(singleOffer); // log the fetched data immediately
        } catch (error) {
          console.error("Error:", error);
          setIsLoading(false);
        }
      }
    };

    getSingleOffer();
  }, [offerId]);

  if (isLoading) {
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
                      padding: $theme.sizing.scale300,
                    }),
                  },
                }}
              >
                <Skeleton height="20px" width="100px" />
                <Block
                  overrides={{
                    Block: {
                      style: ({ $theme }) => ({
                        marginRight: $theme.sizing.scale200,
                        marginLeft: $theme.sizing.scale200,
                      }),
                    },
                  }}
                >
                  <Skeleton height="20px" width="20px" />
                </Block>
                <Skeleton height="20px" width="75px" />
              </Block>
            </Col>
          </Row>
          <Row>
            <Col lg={7}>
              <FlightSummarySkeleton />
            </Col>
          </Row>
        </Container>
      </main>
    );
  }

  const origin = offer.slices[0].origin.city_name;
  const destination =
    offer.slices[offer.slices.length - 1].destination.city_name;

  const slices = offer.slices;

  return (
    <main>
      {offer && (
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
                  {origin}
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
                    {offer.slices.length > 1 ? (
                      <IconArrowsDiff size={20} />
                    ) : (
                      <IconArrowRight size={20} />
                    )}
                  </Block>
                  {destination}
                </HeadingXSmall>
              </Block>
            </Col>
          </Row>
          <Row>
            <Col lg={7}>
              <Card>
                <LabelMedium
                  overrides={{
                    Block: {
                      style: ({ $theme }) => ({
                        marginBottom: 0,
                        fontWeight: "bold",
                      }),
                    },
                  }}
                >
                  Trip summary
                </LabelMedium>
                <ParagraphXSmall
                  overrides={{
                    Block: {
                      style: ({ $theme }) => ({
                        marginTop: $theme.sizing.scale100,
                        color: $theme.colors.contentSecondary,
                      }),
                    },
                  }}
                >
                  Your itinerary for this trip
                </ParagraphXSmall>
                {slices.map((slice, index) => (
                  <FlightStep slice={slice} />
                ))}
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </main>
  );
}
