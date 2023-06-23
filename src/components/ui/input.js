import React, { useState } from "react";

// Base Web
import { Block } from "baseui/block";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { LabelSmall } from "baseui/typography";
import { styled } from "baseui";

// Styled Components
const InputWrapper = styled(Block, {
  position: "relative",
  paddingTop: "$theme.sizing.scale700",
});

const IconLabelWrapper = styled("div", ({ $active, $theme }) => ({
  paddingTop: $theme.sizing.scale500,
  paddingLeft: $theme.sizing.scale600,
  position: "absolute",
  display: "flex",
  alignItems: "center",
}));

const FloatingLabel = styled(LabelSmall, ({ $active, $theme }) => ({
  color: $theme.colors.primary500,
  marginLeft: $theme.sizing.scale400, // To provide space between the icon and label
  transition: "0.2s ease all",
}));

export const InputFloating = ({
  label,
  icon: icon,
  onClick,
  drawerContent,
  ...props
}) => {
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);

  const handleFocus = () => setActive(true);
  const handleBlur = () => setActive(value !== "");

  return (
    <FormControl
      overrides={{
        ControlContainer: {
          style: ({ $theme }) => ({
            marginBottom: $theme.sizing.scale100,
          }),
        },
      }}
    >
      <InputWrapper>
        <IconLabelWrapper>
          {icon && icon}
          <FloatingLabel $active={active || value !== ""}>
            {label}
          </FloatingLabel>
        </IconLabelWrapper>
        <Input
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(event) => setValue(event.target.value)}
          {...props}
          overrides={{
            InputContainer: {
              style: ({ $theme }) => ({
                paddingTop: $theme.sizing.scale700,
              }),
            },
          }}
        />
      </InputWrapper>
    </FormControl>
  );
};
