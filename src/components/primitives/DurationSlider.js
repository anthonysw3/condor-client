import React from "react";

// Base Web
import { Slider } from "baseui/slider";
import { LabelXSmall } from "baseui/typography";
import { useStyletron } from "baseui";

export default function DurationSlider() {
  const [css, theme] = useStyletron();
  const [value, setValue] = React.useState([26]);

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
      onChange={({ value }) => value && setValue(value)}
      onFinalChange={({ value }) => console.log(value)}
      min={10.5}
      max={26}
      step={0.1}
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
            <LabelXSmall>10h 30m</LabelXSmall>
            <LabelXSmall>26h</LabelXSmall>
          </div>
        ),
      }}
    />
  );
}
