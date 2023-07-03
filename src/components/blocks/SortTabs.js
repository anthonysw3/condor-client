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
    <Block
      size={SIZE.compact}
      kind={KIND.secondary}
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginTop: $theme.sizing.scale700,
            marginBottom: $theme.sizing.scale700,
            padding: `${$theme.sizing.scale200}`,
            backgroundColor: `${$theme.colors.backgroundPrimary}`,
            borderRadius: $theme.borders.radius500,
            boxShadow: "0 6px 12px -6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            overflowX: "scroll",
            flexWrap: "nowrap",
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
  let bestIndex;
  switch (sortOption) {
    case "best":
      bestIndex = 0;
      break;
    case "lowestFare":
      bestIndex = sortedData.reduce(
        (minIndex, current, currentIndex, array) => {
          const currentFare = array[minIndex]?.total_amount;
          const nextFare = current?.total_amount;
          return nextFare < currentFare ? currentIndex : minIndex;
        },
        0
      );
      break;
    case "fastest":
      bestIndex = sortedData.reduce(
        (minIndex, current, currentIndex, array) => {
          const currentDuration = array[minIndex]?.slices[0]?.duration;
          const nextDuration = current?.slices[0]?.duration;
          return nextDuration < currentDuration ? currentIndex : minIndex;
        },
        0
      );
      break;
    default:
      bestIndex = 0;
  }
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

const getTitle = (sortOption) => {
  switch (sortOption) {
    case "best":
      return "Best";
    case "lowestFare":
      return "Lowest fare";
    case "fastest":
      return "Fastest";
    default:
      return "";
  }
};

const SortButton = ({
  sortOption,
  activeSort,
  isLoading,
  isSorting,
  sortedData,
  handleSortBy,
}) => (
  <Block
    onClick={() => handleSortBy(sortOption)}
    overrides={{
      Block: {
        style: ({ $theme }) => ({
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          padding: $theme.sizing.scale500,
          marginRight: $theme.sizing.scale200,
          backgroundColor:
            activeSort === sortOption ? $theme.colors.primary50 : "transparent",
          ":hover": {
            backgroundColor: $theme.colors.primary50,
          },
          minWidth: "33.3333%",
          borderRadius: $theme.borders.radius500,
          "::after":
            activeSort === sortOption
              ? {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "3px",
                  backgroundColor: $theme.colors.primary,
                }
              : {},
        }),
      },
    }}
  >
    <LabelSmall
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            fontWeight: "bold",
          }),
        },
      }}
    >
      {getTitle(sortOption)}
    </LabelSmall>
    {isLoading || isSorting ? (
      <LoadingSkeleton />
    ) : (
      <PriceDurationBlock sortOption={sortOption} sortedData={sortedData} />
    )}
  </Block>
);
