import React, { useState } from "react";

// Base Web
import { Block } from "baseui/block";
import { Button, KIND, SIZE, SHAPE } from "baseui/button";
import { LabelMedium } from "baseui/typography";

// Icons
import { IconPlus, IconMinus } from "@tabler/icons-react";

export default function Counter({ travelers }) {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    if (count < 10) {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  return (
    <Block display="flex" alignItems="center">
      <Button
        shape={SHAPE.round}
        kind={KIND.secondary}
        size={SIZE.mini}
        onClick={handleDecrement}
        disabled={count < 1}
      >
        <IconMinus size={16} />
      </Button>
      <Block
        padding="0 8px"
        width="16px"
        alignItems="center"
        justifyContent="center"
      >
        <LabelMedium>{count}</LabelMedium>
      </Block>
      <Button
        shape={SHAPE.round}
        kind={KIND.secondary}
        size={SIZE.mini}
        onClick={handleIncrement}
        disabled={count >= 10}
      >
        <IconPlus size={16} />
      </Button>
    </Block>
  );
}
