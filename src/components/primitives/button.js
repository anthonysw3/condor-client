import React from "react";

// Base Web
import { Button, SIZE, KIND } from "baseui/button";

export function ScrollingButtonCompact({
  label,
  onClick,
  endEnhancer,
  startEnhancer,
  ...props
}) {
  return (
    <Button
      kind={KIND.secondary}
      size={SIZE.mini}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => ({
            marginRight: $theme.sizing.scale200,
          }),
        },
      }}
      onClick={onClick}
      endEnhancer={endEnhancer}
      startEnhancer={startEnhancer}
      {...props}
    >
      {label}
    </Button>
  );
}
