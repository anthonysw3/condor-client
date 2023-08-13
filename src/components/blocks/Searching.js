import React, { useState, useEffect, useRef } from "react";

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

export default function FlightResults({ totalResults }) {
  const [displayedMessage, setDisplayedMessage] = useState(
    "Searching 11 of 321 providers"
  );
  const [providerCount, setProviderCount] = useState(11);

  const initialMount = useRef(true); // Track the initial mount

  // Increment providers
  useEffect(() => {
    const providerIncrementInterval = setInterval(() => {
      if (providerCount < 321) {
        setProviderCount((prev) => Math.min(prev + 100, 321));
      } else {
        clearInterval(providerIncrementInterval);
      }
    }, 7000);

    // Cleanup for the interval
    return () => clearInterval(providerIncrementInterval);
  }, [providerCount]);

  // When totalResults comes in or changes
  useEffect(() => {
    if (initialMount.current) {
      // Check if it's the first render
      initialMount.current = false; // Update the ref to indicate subsequent renders
      return;
    }

    if (providerCount < 321) {
      setDisplayedMessage(`Searching ${providerCount} of 321 providers...`);
    }

    const timeout = setTimeout(() => {
      if (providerCount >= 321) {
        setDisplayedMessage("More results found...");
        const anotherTimeout = setTimeout(() => {
          setDisplayedMessage(`${totalResults} results`);
        }, 1000);
        // Cleanup for the inner timeout
        return () => clearTimeout(anotherTimeout);
      } else {
        setDisplayedMessage(`${totalResults} results`);
      }
    }, 1000);

    // Cleanup for the outer timeout
    return () => clearTimeout(timeout);
  }, [totalResults, providerCount]);

  return (
    <Block display="flex" alignItems="center">
      {(displayedMessage.startsWith("Searching") ||
        displayedMessage.startsWith("More results found")) && <CustomSpinner />}
      <Block marginLeft="scale300">{displayedMessage}</Block>
    </Block>
  );
}
