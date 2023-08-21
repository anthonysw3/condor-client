import React from "react";
import { withStyle } from "baseui";
import { Block } from "baseui/block";
import { Spinner } from "baseui/spinner";

const CustomSpinner = withStyle(Spinner, {
  width: "16px",
  height: "16px",
  borderLeftWidth: "1px",
  borderRightWidth: "1px",
  borderTopWidth: "1px",
  borderBottomWidth: "1px",
  borderTopColor: "primary",
});

export default function FlightResults({ totalResults, searchProgress }) {
  const displayedMessage =
    searchProgress < 100 ? "Searching..." : `${totalResults} results`;

  return (
    <Block display="flex" alignItems="center">
      {searchProgress < 100 && <CustomSpinner />}
      <Block marginLeft="scale300">{displayedMessage}</Block>
    </Block>
  );
}
