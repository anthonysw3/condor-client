import React, { useState, useEffect } from "react";

// DayJS
import dayjs from "dayjs";

// Base Web
import { Block } from "baseui/block";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button, SHAPE, SIZE, KIND } from "baseui/button";
import { LabelXSmall, LabelMedium } from "baseui/typography";
import { styled } from "baseui";

// Icons
import {
  IconCalendarEvent,
  IconUsers,
  IconPlus,
  IconMinus,
} from "@tabler/icons-react";

// Styled Components
const InputWrapper = styled(Block, ({ $active, $theme }) => ({
  position: "relative",
}));

const FloatingLabel = styled(LabelXSmall, ({ $active, $theme }) => ({
  color: $theme.colors.primary500,
}));

const LabelWrapper = styled("div", ({ $active, $theme }) => ({
  paddingTop: $theme.sizing.scale500,
  paddingLeft: $theme.sizing.scale600,
  position: "absolute",
  display: "flex",
  alignItems: "center",
}));

const SubTextLabel = styled(LabelXSmall, ({ $theme }) => ({
  position: "absolute",
  bottom: $theme.sizing.scale500,
  color: $theme.colors.primary500,
  paddingLeft: $theme.sizing.scale600,
}));

const DateButtonWrapper = styled(Block, ({ $theme }) => ({
  position: "absolute",
  bottom: $theme.sizing.scale500,
  paddingLeft: $theme.sizing.scale600,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}));

const DateButton = styled(LabelXSmall, ({ $theme }) => ({
  bottom: $theme.sizing.scale500,
  color: $theme.colors.primary,
  marginRight: $theme.sizing.scale900,
}));

export const InputPersons = ({ label, passengers, onClick, ...props }) => {
  const disableDecrement = passengers < 2;
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            borderRadius: $theme.borders.radius300,
            padding: $theme.sizing.scale300,
            display: "flex",
            flexDirection: "column",
          }),
        },
      }}
    >
      <LabelXSmall
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              textTransform: "uppercase",
              color: $theme.colors.primary500,
              marginBottom: $theme.sizing.scale100,
            }),
          },
        }}
      >
        {label}
      </LabelXSmall>
      <Block
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: $theme.sizing.scale100,
            }),
          },
        }}
      >
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                display: "flex",
                alignItems: "center",
              }),
            },
          }}
        >
          <IconUsers size={18} />
          <LabelMedium
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  fontWeight: "bold",
                  marginLeft: $theme.sizing.scale200,
                }),
                props: {
                  onClick: onClick,
                },
              },
            }}
          >
            {passengers}
          </LabelMedium>
        </Block>
        <Block
          overrides={{
            Block: {
              style: {
                display: "flex",
              },
            },
          }}
        >
          <Button
            kind={KIND.secondary}
            size={SIZE.mini}
            shape={SHAPE.circle}
            disabled={disableDecrement}
            onClick={onClick}
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
          <Button
            kind={KIND.secondary}
            size={SIZE.mini}
            shape={SHAPE.circle}
            onClick={onClick}
          >
            <IconPlus size={12} />
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export const InputStatus = ({
  label,
  status,
  onClick,
  loyaltyProgramsCount,
  ...props
}) => {
  const buttonLabel =
    loyaltyProgramsCount < 1 ? "Add program" : `Add another program`;
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            borderRadius: $theme.borders.radius300,
            padding: $theme.sizing.scale300,
            display: "flex",
            flexDirection: "column",
          }),
        },
      }}
    >
      <LabelXSmall
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              textTransform: "uppercase",
              color: $theme.colors.primary500,
              marginBottom: $theme.sizing.scale100,
            }),
          },
        }}
      >
        {label}
      </LabelXSmall>
      <Block
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: $theme.sizing.scale100,
            }),
          },
        }}
      >
        <Block
          overrides={{
            Block: {
              style: {
                display: "flex",
              },
            },
          }}
        >
          <Button
            kind={KIND.secondary}
            size={SIZE.mini}
            shape={SHAPE.pill}
            onClick={onClick}
            startEnhancer={
              loyaltyProgramsCount > 0 ? loyaltyProgramsCount : null
            }
            endEnhancer={() => <IconPlus size={12} />}
          >
            {buttonLabel}
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export const InputText = ({
  label,
  initialValue,
  subText,
  onChange,
  onClick,
  clearable,
  ...props
}) => {
  const [value, setValue] = useState(initialValue || "");
  const handleChange = (event) => {
    setValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <FormControl
      overrides={{
        ControlContainer: {
          style: ({ $theme }) => ({
            marginBottom: 0,
          }),
        },
      }}
    >
      <InputWrapper>
        <LabelWrapper>
          {label && <FloatingLabel>{label}</FloatingLabel>}
        </LabelWrapper>
        <Input
          clearable={clearable}
          value={value}
          onChange={handleChange}
          {...props}
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                backgroundColor: $theme.colors.backgroundPrimary,
                paddingRight: $theme.sizing.scale400,
                borderWidth: "1px",
                borderColor: $theme.colors.primary200,
                borderRadius: $theme.borders.radius300,
              }),
              props: {
                onClick: onClick,
              },
            },
            InputContainer: {
              style: ({ $theme }) => ({
                paddingTop: label ? $theme.sizing.scale700 : 0,
                paddingBottom: subText
                  ? $theme.sizing.scale700
                  : $theme.sizing.scale100,
                backgroundColor: $theme.colors.backgroundPrimary,
              }),
            },
            Input: {
              style: ({ $theme }) => ({
                fontWeight: "bold",
                fontSize: $theme.typography.LabelMedium.fontSize,
              }),
            },
          }}
        />
        {subText && <SubTextLabel>{subText}</SubTextLabel>}
      </InputWrapper>
    </FormControl>
  );
};

export const InputDatePick = ({
  label,
  value,
  placeholder,
  subText,
  onClick,
  clearable,
  ...props
}) => {
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
        <LabelWrapper style={{ zIndex: 3 }}>
          {label && <FloatingLabel>{label}</FloatingLabel>}
        </LabelWrapper>
        <Input
          clearable={clearable}
          value={value ? dayjs(value).format("ddd, DD MMM") : ""}
          onChange={(event) => setValue(event.target.value)}
          endEnhancer={() => <IconCalendarEvent size={22} />}
          placeholder={placeholder}
          {...props}
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                backgroundColor: $theme.colors.backgroundPrimary,
                paddingRight: $theme.sizing.scale400,
                borderWidth: "1px",
                borderColor: $theme.colors.primary200,
                borderRadius: $theme.borders.radius300,
                position: "relative",
                zIndex: 1,
              }),
              props: {
                onMouseDown: (event) => {
                  event.preventDefault();
                  onClick && onClick();
                },
                onFocus: (event) => {
                  event.preventDefault();
                  onClick && onClick();
                },
              },
            },
            InputContainer: {
              style: ({ $theme }) => ({
                paddingTop: label ? $theme.sizing.scale700 : 0,
                paddingBottom: $theme.sizing.scale700,
                backgroundColor: $theme.colors.backgroundPrimary,
              }),
            },
            Input: {
              style: ({ $theme }) => ({
                fontWeight: "bold",
                fontSize: $theme.typography.LabelMedium.fontSize,
                backgroundColor: $theme.colors.backgroundPrimary,
                paddingRight: 0,
                marginRight: 0,
              }),
            },
            EndEnhancer: {
              style: ({ $theme }) => ({
                backgroundColor: $theme.colors.backgroundPrimary,
                marginLeft: 0,
                paddingLeft: 0,
                paddingRight: 0,
                "::before": {
                  content: '""',
                  position: "absolute",
                  marginRight: "50px",
                  top: "1px",
                  bottom: "1px",
                  width: $theme.sizing.scale900,
                  background: `linear-gradient(to right, transparent, ${$theme.colors.backgroundPrimary})`,
                },
              }),
            },
          }}
        />
        {value && (
          <DateButtonWrapper style={{ zIndex: 3 }}>
            <DateButton>Prev</DateButton>
            <DateButton>Next</DateButton>
          </DateButtonWrapper>
        )}
      </InputWrapper>
    </FormControl>
  );
};
