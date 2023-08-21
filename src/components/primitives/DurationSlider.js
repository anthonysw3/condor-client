import React, { useState } from "react";

// Base Web
import { Slider } from "baseui/slider";
import { LabelXSmall } from "baseui/typography";
import { useStyletron } from "baseui";

export default function DurationSlider({
  onFinalChange,
  maxTime,
  minTime,
  persistedTime,
}) {
  const [css, theme] = useStyletron();
  const [value, setValue] = useState([persistedTime || 72]);

  const formatHour = (val) => {
    const hours = Math.floor(val);
    const minutes = Math.round((val - hours) * 60);

    if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <Slider
      value={value}
      onChange={({ value }) => {
        console.log("Slider onChange Value:", value);
        setValue(value);
      }}
      onFinalChange={({ value }) => {
        if (value && onFinalChange) {
          onFinalChange(value[0]);
        }
      }}
      min={minTime || 0}
      max={maxTime || 72}
      step={0.5}
      overrides={{
        InnerThumb: () => null,
        ThumbValue: ({ $value, $thumbIndex }) => (
          <div
            className={css({
              position: "absolute",
              top: `-${theme.sizing.scale800}`,
              ...theme.typography.font100,
              backgroundColor: theme.colors.backgroundPrimary,
              padding: theme.sizing.scale100,
              paddingBottom: 0,
              whiteSpace: "nowrap",
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
            <LabelXSmall>{formatHour(minTime)}</LabelXSmall>
            <LabelXSmall>{formatHour(maxTime)}</LabelXSmall>
          </div>
        ),
      }}
    />
  );
}
