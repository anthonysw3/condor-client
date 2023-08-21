import React, { useState } from "react";

// Base Web
import { Slider } from "baseui/slider";
import { LabelXSmall } from "baseui/typography";
import { useStyletron } from "baseui";

export default function HourSlider({ label, currentRange, onValueChange }) {
  const [css, theme] = useStyletron();
  const [value, setValue] = useState(currentRange || [0, 24]);

  const formatHour = (val) => {
    let hour = Math.floor(val);
    let period = hour < 12 || hour === 0 ? "am" : "pm";
    hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    // Adjusting for the 24 => 12am case
    if (val === 24) {
      hour = 12;
      period = "am";
    }

    return `${hour}${period}`;
  };

  return (
    <Slider
      value={value}
      onChange={({ value }) => value && setValue(value)}
      onFinalChange={({ value }) => {
        onValueChange(label, value);
      }}
      min={0}
      max={24}
      step={1}
      overrides={{
        InnerThumb: () => null,
        ThumbValue: ({ $value, $thumbIndex }) => (
          <div
            className={css({
              position: "absolute",
              top: `-${theme.sizing.scale800}`,
              ...theme.typography.font200,
              backgroundColor: theme.colors.backgroundPrimary,
            })}
          >
            {formatHour($value[$thumbIndex])}
          </div>
        ),
        TickBar: () => (
          <div
            className={css({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: theme.sizing.scale400,
            })}
          >
            <LabelXSmall>12am</LabelXSmall>
            <LabelXSmall>6am</LabelXSmall>
            <LabelXSmall>12pm</LabelXSmall>
            <LabelXSmall>6pm</LabelXSmall>
            <LabelXSmall>12am</LabelXSmall>
          </div>
        ),
      }}
    />
  );
}
