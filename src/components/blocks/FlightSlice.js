import React from "react";

// Base Web
import { Block } from "baseui/block";
import {
  LabelSmall,
  LabelMedium,
  LabelLarge,
  ParagraphXSmall,
} from "baseui/typography";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { useStyletron } from "baseui";

// React Grid System
import { Container, Row, Col } from "react-grid-system";

// Icons
import { IconCircleDot } from "@tabler/icons-react";

// Helpers
import { formatDuration } from "../utils/helpers/dateUtils";
import { getCurrencySymbol } from "../utils/helpers/currencyUtils";

export default function FlightSlice({ slice }) {
  const [css, $theme] = useStyletron();
  // Determine outbound and arrival times
  const firstStop = slice.segments[0];
  const lastSegment = slice.segments[slice.segments.length - 1];
  const lastStop = lastSegment.stops[lastSegment.stops.length - 1];
  const outboundTime = firstStop.departing_at;
  const arrivalTime =
    slice.segments.length === 0
      ? firstStop.arriving_at
      : lastSegment.arriving_at;

  // Determine number of segments
  const numSegments = slice.segments.length;

  // Filter the segments with a difference
  const differentSegments = slice.segments.filter(
    (segment, index, self) =>
      segment.operating_carrier.name !== segment.marketing_carrier.name &&
      self.findIndex(
        (s) => s.operating_carrier.name === segment.operating_carrier.name
      ) === index
  );

  // Determine the message and get the logo_symbol_url for different segments
  let message;
  let differentCarriersLogoUrls = [];
  if (differentSegments.length > 0) {
    const differentCarriers = differentSegments.map((segment) => {
      differentCarriersLogoUrls.push(segment.operating_carrier.logo_symbol_url);
      return segment.operating_carrier.name;
    });

    if (differentSegments.length === slice.segments.length) {
      message = `Operated by ${differentCarriers.join(", ")}`;
    } else {
      message = `Partly operated by ${differentCarriers.join(", ")}`;
    }
  }

  return (
    <Container style={{ padding: 0, marginBottom: $theme.sizing.scale600 }}>
      <Row>
        <Col xs={2}>
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  height: "100%",
                  width: "100%",
                }),
              },
            }}
          >
            <Block
              as="img"
              src={firstStop.marketing_carrier.logo_symbol_url}
              alt="Image"
              height="32px"
              width="32px"
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    margin: "0 auto",
                  }),
                },
              }}
            />
          </Block>
        </Col>
        <Col xs={3}>
          <LabelLarge
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  fontWeight: "bold",
                  textAlign: "right",
                  marginTop: "1px",
                  marginBottom: $theme.sizing.scale100,
                }),
              },
            }}
          >
            {outboundTime.substr(11, 5)}
          </LabelLarge>
          <LabelMedium
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  textAlign: "right",
                }),
              },
            }}
          >
            {slice.origin.iata_code}
          </LabelMedium>
        </Col>
        <Col xs={4}>
          <Block>
            <ParagraphXSmall
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    fontSize: "0.6rem",
                    textAlign: "center",
                    marginTop: 0,
                    marginBottom: 0,
                  }),
                },
              }}
            >
              {formatDuration(slice.duration)}
            </ParagraphXSmall>
          </Block>
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: `-${$theme.sizing.scale100}`,
                  height: $theme.sizing.scale500,
                }),
              },
            }}
          >
            {Array(numSegments)
              .fill()
              .map((_, index) => (
                <>
                  <Block
                    overrides={{
                      Block: {
                        style: ({ $theme }) => ({
                          height: "2px",
                          width:
                            index === 0 || index === numSegments - 1
                              ? "100%"
                              : $theme.sizing.scale1000,
                          background:
                            numSegments === 1
                              ? `linear-gradient(to right, transparent, ${$theme.colors.primary200}, transparent)`
                              : index === 0
                              ? `linear-gradient(to right, transparent, ${$theme.colors.primary200})`
                              : index === numSegments - 1
                              ? `linear-gradient(to right, ${$theme.colors.primary200}, transparent)`
                              : $theme.colors.primary200,
                        }),
                      },
                    }}
                  ></Block>
                  {index < numSegments - 1 && <IconCircleDot size={16} />}
                </>
              ))}
          </Block>

          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  textAlign: "center",
                }),
              },
            }}
          >
            <Badge
              content={
                numSegments < 2
                  ? "Direct"
                  : `${numSegments - 1} stop${numSegments - 1 !== 1 ? "s" : ""}`
              }
              hierarchy={HIERARCHY.secondary}
              color={numSegments < 2 ? COLOR.positive : COLOR.warning}
              overrides={{
                Badge: {
                  style: ({ $theme }) => ({
                    marginTop: `-${$theme.sizing.scale500}`,
                    fontSize: "0.6rem",
                  }),
                },
              }}
            />
          </Block>
        </Col>
        <Col xs={3}>
          <LabelLarge
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  fontWeight: "bold",
                  marginTop: "1px",
                  marginBottom: $theme.sizing.scale100,
                }),
              },
            }}
          >
            {arrivalTime.substr(11, 5)}
          </LabelLarge>
          <LabelMedium>{slice.destination.iata_code}</LabelMedium>
        </Col>
      </Row>
      {message && (
        <Row>
          <Col>
            <Block
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    display: "flex",
                    alignItems: "center",
                    marginTop: $theme.sizing.scale100,
                  }),
                },
              }}
            >
              {differentCarriersLogoUrls.map((logoUrl, index) => (
                <Block
                  key={index}
                  as="img"
                  src={logoUrl}
                  alt="Image"
                  height="18px"
                  width="18px"
                  overrides={{
                    Block: {
                      style: ({ $theme }) => ({
                        marginRight: $theme.sizing.scale200,
                      }),
                    },
                  }}
                />
              ))}
              <ParagraphXSmall
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      color: $theme.colors.primary500,
                    }),
                  },
                }}
              >
                {message}
              </ParagraphXSmall>
            </Block>
          </Col>
        </Row>
      )}
    </Container>
  );
}
