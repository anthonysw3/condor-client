import React from "react";

// Base Web UI
import { Block } from "baseui/block";
import { Button, SIZE, KIND } from "baseui/button";
import {
  LabelSmall,
  ParagraphMedium,
  ParagraphXSmall,
} from "baseui/typography";
import { Skeleton } from "baseui/skeleton";
import { useStyletron } from "baseui";

// Icons
import { IconInfoCircle } from "@tabler/icons-react";

// Helpers
import { getCurrencySymbol } from "../utils/helpers/currencyUtils";
import { formatDuration } from "../utils/helpers/dateUtils";

// Components
import { Card } from "../primitives/card";

const sortTitleMap = {
  best: "Best",
  lowestFare: "Lowest fare",
  fastest: "Fastest",
};

export default function SortTabs({
  sortBy,
  isLoading,
  isSorting,
  sortedData,
  handleSortBy,
}) {
  const [css, theme] = useStyletron();
  return (
    <Card padding={`${theme.sizing.scale200}`}>
      <Block
        size={SIZE.compact}
        kind={KIND.secondary}
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              display: "flex",
              overflowX: "scroll",
              flexWrap: "nowrap",
              marginLeft: `-${$theme.sizing.scale600}`,
              marginRight: `-${$theme.sizing.scale600}`,
              paddingLeft: $theme.sizing.scale700,
              paddingRight: $theme.sizing.scale600,
              WebkitOverflowScrolling: "touch",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Hide scrollbar on Windows devices
              "@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)":
                {
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  "-ms-overflow-style": "none",
                  scrollbarWidth: "none",
                },
            }),
          },
        }}
      >
        {["best", "lowestFare", "fastest"].map((sortOption) => (
          <SortButton
            key={sortOption}
            sortOption={sortOption}
            activeSort={sortBy}
            isLoading={isLoading}
            isSorting={isSorting}
            sortedData={sortedData}
            handleSortBy={handleSortBy}
          />
        ))}
      </Block>
    </Card>
  );
}

const LoadingSkeleton = () => (
  <Block>
    <Skeleton
      width="60px"
      height="20px"
      overrides={{
        Root: {
          style: ({ $theme }) => ({
            marginTop: $theme.sizing.scale200,
            marginBottom: 0,
          }),
        },
      }}
      animation
    />
    <Skeleton
      width="45px"
      height="16px"
      overrides={{
        Root: {
          style: ({ $theme }) => ({
            marginTop: $theme.sizing.scale200,
            marginBottom: 0,
          }),
        },
      }}
      animation
    />
  </Block>
);

const PriceDurationBlock = ({ sortOption, sortedData }) => {
  const bestIndex = sortOption === "best" ? 0 : sortedData.length - 1;

  return (
    <Block>
      <ParagraphMedium
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale100,
              marginBottom: 0,
              fontWeight: "bold",
            }),
          },
        }}
      >
        {getCurrencySymbol(sortedData[bestIndex]?.base_currency)}
        {sortedData[bestIndex]?.passengers.length > 0
          ? Math.ceil(
              sortedData[bestIndex]?.total_amount /
                sortedData[bestIndex]?.passengers.length
            )
          : null}
      </ParagraphMedium>
      <ParagraphXSmall
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: 0,
              marginBottom: 0,
            }),
          },
        }}
      >
        {formatDuration(sortedData[bestIndex]?.slices[0]?.duration)}
      </ParagraphXSmall>
    </Block>
  );
};

const SortButton = ({
  sortOption,
  activeSort,
  isLoading,
  isSorting,
  sortedData,
  handleSortBy,
}) => (
  <Button
    kind={KIND.tertiary}
    active={activeSort === sortOption}
    onClick={() => handleSortBy(sortOption)}
    overrides={{
      ButtonBase: {
        style: ({ $theme }) => ({
          borderBottom: `1px solid ${$theme.colors.primary500}`,
          width: "calc(100% / 3)",
        }),
      },
    }}
  >
    <Block display="flex" flexDirection="column" alignItems="start">
      <LabelSmall
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              fontWeight: "bold",
            }),
          },
        }}
      >
        {sortTitleMap[sortOption]}
      </LabelSmall>
      {isLoading || isSorting ? (
        <LoadingSkeleton />
      ) : (
        <PriceDurationBlock sortOption={sortOption} sortedData={sortedData} />
      )}
    </Block>
  </Button>
);
