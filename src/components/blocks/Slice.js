import React from "react";

// Base Web
import { Block } from "baseui/block";
import {
  LabelSmall,
  LabelMedium,
  LabelLarge,
  ParagraphXSmall,
} from "baseui/typography";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { useStyletron } from "baseui";

// React Grid System
import { Container, Row, Col } from "react-grid-system";

// Icons
import { IconCircleDot } from "@tabler/icons-react";
import { IconArrowRight } from "@tabler/icons-react";

// Helpers
import { formatDuration } from "../utils/helpers/dateUtils";

export default function Slice({ slice }) {
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

  const duration = formatDuration(slice.duration);
  const hours = duration.split("h")[0];
  const minutes = duration.split("h")[1].split("m")[0].trim();

  return (
    <Container style={{ padding: 0, marginTop: $theme.sizing.scale400 }}>
      <Row>
        <Col xs={5}>
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  display: "flex",
                }),
              },
            }}
          >
            <LabelMedium
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    display: "flex",
                    alignItems: "center",
                    marginTop: 0,
                    marginBottom: $theme.sizing.scale200,
                  }),
                },
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                {slice.origin.iata_code}
              </span>
              <Block
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      marginLeft: $theme.sizing.scale100,
                      marginRight: $theme.sizing.scale100,
                      display: "flex",
                      alignItems: "center",
                    }),
                  },
                }}
              >
                <IconArrowRight size={16} color={$theme.colors.primary400} />
              </Block>
              <span style={{ color: $theme.colors.primary400 }}>
                {slice.destination.iata_code}
              </span>
            </LabelMedium>
            {differentCarriersLogoUrls.map((logoUrl, index) => (
              <Block
                key={index}
                as="img"
                src={logoUrl}
                alt="Image"
                height="22px"
                width="22px"
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      marginLeft: $theme.sizing.scale300,
                    }),
                  },
                }}
              />
            ))}
          </Block>

          <LabelMedium
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
            {`${outboundTime.substr(11, 5)} - ${arrivalTime.substr(11, 5)}`}
          </LabelMedium>
        </Col>
        <Col xs={3}>
          <LabelMedium
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  color: $theme.colors.primary300,
                  marginBottom: $theme.sizing.scale200,
                }),
              },
            }}
          >
            Duration
          </LabelMedium>
          <LabelMedium>
            <span>{hours} </span>
            <span style={{ color: $theme.colors.primary500 }}>hr </span>
            <span>{minutes} </span>
            <span style={{ color: $theme.colors.primary500 }}>min</span>
          </LabelMedium>
        </Col>
        <Col xs={4}>
          <LabelMedium
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  color: $theme.colors.primary300,
                  textAlign: "right",
                  marginBottom: $theme.sizing.scale200,
                }),
              },
            }}
          >
            Transfer
          </LabelMedium>
          <LabelMedium
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  textAlign: "right",
                }),
              },
            }}
          >
            {numSegments < 2 ? (
              <span style={{ color: $theme.colors.positive }}>Direct</span>
            ) : (
              `${numSegments - 1} stop${numSegments - 1 !== 1 ? "s" : ""}`
            )}
          </LabelMedium>
        </Col>
      </Row>
    </Container>
  );
}
