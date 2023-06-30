import React from "react";

// Base Web
import { Block } from "baseui/block";
import { LabelSmall, LabelMedium } from "baseui/typography";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { useStyletron } from "baseui";

// Icons
import { IconCircleDot } from "@tabler/icons-react";

// Helpers
import { formatDuration } from "../utils/helpers/dateUtils";
import { getCurrencySymbol } from "../utils/helpers/currencyUtils";

export default function FlightSlice({ slice }) {
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

  return (
    <FlexGrid
      flexGridColumnCount={3}
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginBottom: $theme.sizing.scale800,
          }),
        },
      }}
    >
      <FlexGridItem
        overrides={{
          Block: {
            style: {
              width: "25%",
              flexGrow: 0,
              display: "block",
              textAlign: "left",
            },
          },
        }}
      >
        <LabelMedium
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                fontWeight: "bold",
                marginTop: $theme.sizing.scale300,
              }),
            },
          }}
        >
          {outboundTime.substr(11, 5)}
        </LabelMedium>
        <LabelSmall>{slice.origin.iata_code}</LabelSmall>
      </FlexGridItem>
      <FlexGridItem
        overrides={{
          Block: {
            style: {
              width: "50%",
              flexGrow: 0,
              display: "block",
              textAlign: "center",
            },
          },
        }}
      >
        <Block>
          <Badge
            content={formatDuration(slice.duration)}
            hierarchy={HIERARCHY.secondary}
            color={COLOR.primary}
            overrides={{
              Badge: {
                style: ({ $theme }) => ({
                  fontSize: "0.6rem",
                }),
              },
            }}
          />
        </Block>
        <Block display="flex" justifyContent="center" alignItems="center">
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

        <Block>
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
                  marginTop: $theme.sizing.scale200,
                  fontSize: "0.6rem",
                }),
              },
            }}
          />
        </Block>
      </FlexGridItem>
      <FlexGridItem
        overrides={{
          Block: {
            style: {
              width: "25%",
              flexGrow: 0,
              display: "block",
              textAlign: "right",
            },
          },
        }}
      >
        <LabelMedium
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                fontWeight: "bold",
                marginTop: $theme.sizing.scale300,
              }),
            },
          }}
        >
          {arrivalTime.substr(11, 5)}
        </LabelMedium>
        <LabelSmall>{slice.destination.iata_code}</LabelSmall>
      </FlexGridItem>
    </FlexGrid>
  );
}
