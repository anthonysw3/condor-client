import React, { useState, useEffect } from "react";

// Base Web
import { LabelSmall } from "baseui/typography";

const RotatingText = ({ totalResults, airlines }) => {
  const phrases = [
    { text: `Searching ${airlines} airlines...`, duration: 7000 }, // 7 seconds
    { text: "Requesting additional fares...", duration: 10000 }, // 10 seconds
    { text: "Looking for lowest fares...", duration: 3000 }, // 3 seconds
    { text: "Looking for fastest journey...", duration: 5000 }, // 5 seconds
    { text: "Sorting best options...", duration: 5000 }, // 5 seconds
    { text: "Personalising recommendations...", duration: 5000 }, // 5 seconds
    { text: `${totalResults} results`, duration: Infinity }, // Infinite duration
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const duration = currentPhrase.duration;

    if (duration === Infinity) return; // Skip rotation for infinite duration phrase

    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, duration);

    return () => {
      clearInterval(interval);
    };
  }, [currentPhraseIndex]);

  return (
    <LabelSmall
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginTop: $theme.sizing.scale400,
          }),
        },
      }}
    >
      {phrases[currentPhraseIndex].text}
    </LabelSmall>
  );
};

export default RotatingText;
