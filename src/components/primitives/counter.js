import React from "react";

// Base Web
import { Block } from "baseui/block";
import { Button, KIND, SIZE, SHAPE } from "baseui/button";
import { LabelSmall } from "baseui/typography";

// Icons
import { IconMinus, IconPlus } from "@tabler/icons-react";

export const Counter = ({ value, onValueChange, min = 0, max = 10 }) => {
  const increment = () => {
    if (value < max) {
      const newValue = value + 1;
      if (onValueChange) {
        onValueChange(newValue);
      }
    }
  };

  const decrement = () => {
    if (value > min) {
      const newValue = value - 1;
      if (onValueChange) {
        onValueChange(newValue);
      }
    }
  };

  const disableDecrement = value <= min;
  const disableIncrement = value >= max;

  return (
    <Block
      display="flex"
      alignItems="center"
      overrides={{
        Block: {
          style: {
            maxWidth: "scale900",
          },
        },
      }}
    >
      <Button
        kind={KIND.secondary}
        size={SIZE.mini}
        shape={SHAPE.circle}
        disabled={disableDecrement}
        onClick={decrement}
        overrides={{
          BaseButton: {
            style: ({ $theme }) => ({
              marginRight: $theme.sizing.scale100,
            }),
          },
        }}
      >
        <IconMinus size={12} />
      </Button>
      <LabelSmall
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              width: $theme.sizing.scale900,
              textAlign: "center",
            }),
          },
        }}
      >
        {value}
      </LabelSmall>
      <Button
        kind={KIND.secondary}
        size={SIZE.mini}
        shape={SHAPE.circle}
        disabled={disableIncrement}
        onClick={increment}
      >
        <IconPlus size={12} />
      </Button>
    </Block>
  );
};
