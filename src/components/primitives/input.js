import React from "react";

// Base Web
import { Block } from "baseui/block";
import { Button, SHAPE, SIZE, KIND } from "baseui/button";
import { LabelXSmall, LabelMedium, LabelLarge } from "baseui/typography";

// Icons
import {
  IconCalendarEvent,
  IconUsers,
  IconPlus,
  IconMinus,
} from "@tabler/icons-react";

export const InputLocation = ({ label, value, subLabel, ...props }) => {
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            borderRadius: $theme.borders.radius500,
            border: `1px solid ${$theme.colors.primary200}`,
            padding: $theme.sizing.scale500,
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
            }),
          },
        }}
      >
        {label}
      </LabelXSmall>
      <LabelLarge
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              fontWeight: "bold",
              marginTop: $theme.sizing.scale100,
              marginBottom: $theme.sizing.scale100,
            }),
          },
        }}
      >
        {value}
      </LabelLarge>
      <LabelXSmall>{subLabel}</LabelXSmall>
    </Block>
  );
};

export const InputDate = ({ label, date, ...props }) => {
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            borderRadius: $theme.borders.radius500,
            border: `1px solid ${$theme.colors.primary200}`,
            padding: $theme.sizing.scale500,
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
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }),
          },
        }}
      >
        <LabelLarge
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                fontWeight: "bold",
                marginTop: $theme.sizing.scale100,
                marginBottom: $theme.sizing.scale100,
              }),
            },
          }}
        >
          {date}
        </LabelLarge>
        <Block>
          <IconCalendarEvent size={24} />
        </Block>
      </Block>
      <Block
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }),
          },
        }}
      >
        <LabelXSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginRight: $theme.sizing.scale900,
              }),
            },
          }}
        >
          Prev
        </LabelXSmall>
        <LabelXSmall>Next</LabelXSmall>
      </Block>
    </Block>
  );
};

export const InputPersons = ({
  label,
  adults,
  children,
  infants,
  ...props
}) => {
  const persons = adults + (children || 0) + (infants || 0);
  const disableDecrement = persons < 2;
  const handleDecrement = () => {
    if (persons > 0) {
      // handle the decrement logic here
    }
  };

  const handleIncrement = () => {
    // handle the increment logic here
  };
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            borderRadius: $theme.borders.radius500,
            padding: $theme.sizing.scale500,
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
              },
            }}
          >
            {persons}
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
            onClick={handleDecrement}
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
            onClick={handleIncrement}
          >
            <IconPlus size={12} />
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export const InputStatus = ({ label, status, ...props }) => {
  const programs = status < 1 ? "None added" : status + " programs";
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            borderRadius: $theme.borders.radius500,
            padding: $theme.sizing.scale500,
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
            endEnhancer={() => <IconPlus size={12} />}
          >
            Add program
          </Button>
        </Block>
      </Block>
    </Block>
  );
};
