import React from "react";

// Base Web
import { Block } from "baseui/block";
import { HeadingXSmall } from "baseui/typography";
import { Button, SIZE, KIND } from "baseui/button";

import { useLayer } from "@/contexts/LayerProvider";

// Icons
import {
  IconArrowsDiff,
  IconArrowRight,
  IconEdit,
  IconChevronDown,
} from "@tabler/icons-react";
import { useStyletron } from "baseui";

// Components
import Calendar, { CalendarFooter } from "./Calendar";
import Passengers from "./Passengers";
import FlightSearch from "./FlightSearch";

import { formatDatetoDateMonth } from "../utils/helpers/dateUtils";

export default function EditBlock({
  origin,
  destination,
  outbound,
  inbound,
  adults,
  children,
  infants,
  travelClass,
}) {
  const [css, theme] = useStyletron();
  const { openLayer, closeLayer } = useLayer();

  // Handlers
  const handleEditDrawer = () => {
    const title = `Edit your trip`;
    const content = <FlightSearch />;

    openLayer(title, content);
  };

  const handleCalendarDrawer = () => {
    const title = "Choose your dates";
    const callbacks = {
      onChange: (selectedDates) => {
        dispatch(setDates(selectedDates));
        closeModal();
      },
    };
    const content = <Calendar onChange={callbacks.onChange} />;
    const footer = <CalendarFooter />;

    openLayer(title, content, footer, callbacks);
  };

  const handlePassengerDrawer = () => {
    const title = "Who's travelling?";
    const callbacks = {
      onClose: async () => {
        closeModal();
        await refreshFlightOffers();
      },
    };
    const content = <Passengers onChange={callbacks.onChange} />;

    openLayer(title, content, null, callbacks);
  };

  return (
    <hgroup>
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
        <HeadingXSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                display: "flex",
                alignItems: "center",
                marginTop: 0,
                marginBottom: 0,
                marginLeft: $theme.sizing.scale200,
              }),
            },
          }}
        >
          {origin.name}
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginLeft: $theme.sizing.scale300,
                  marginRight: $theme.sizing.scale300,
                  display: "flex",
                  alignItems: "center",
                }),
              },
            }}
          >
            {destination ? (
              <IconArrowsDiff size={20} />
            ) : (
              <IconArrowRight size={20} />
            )}
          </Block>
          {destination.name}
        </HeadingXSmall>
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginLeft: $theme.sizing.scale300,
              }),
            },
          }}
        >
          <IconEdit
            size={20}
            color={theme.colors.primary500}
            onClick={handleEditDrawer}
          />
        </Block>
      </Block>
      <Block
        size={SIZE.compact}
        kind={KIND.secondary}
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              display: "flex",
              overflowX: "scroll",
              flexWrap: "nowrap",
              marginTop: $theme.sizing.scale200,
              marginLeft: `-${$theme.sizing.scale600}`,
              marginRight: `-${$theme.sizing.scale600}`,
              paddingLeft: $theme.sizing.scale700,
              paddingRight: $theme.sizing.scale600,
              WebkitOverflowScrolling: "touch",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Hide scrollbar on Windows devices
              "@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)":
                {
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  "-ms-overflow-style": "none",
                  scrollbarWidth: "none",
                },
            }),
          },
        }}
      >
        <Button
          size={SIZE.compact}
          kind={KIND.tertiary}
          endEnhancer={() => <IconChevronDown size={16} />}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                flex: "0 0 auto",
                whiteSpace: "nowrap",
                border: `1px solid ${$theme.colors.primary200}`,
                marginRight: $theme.sizing.scale200,
              }),
            },
          }}
          onClick={handleCalendarDrawer}
        >{`${formatDatetoDateMonth(outbound)}${
          inbound ? ` - ${formatDatetoDateMonth(inbound)}` : ""
        }`}</Button>
        <Button
          size={SIZE.compact}
          kind={KIND.tertiary}
          endEnhancer={() => <IconChevronDown size={16} />}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                flex: "0 0 auto",
                whiteSpace: "nowrap",
                border: `1px solid ${$theme.colors.primary200}`,
                marginRight: $theme.sizing.scale200,
              }),
            },
          }}
          onClick={handlePassengerDrawer}
        >{`${adults + children + infants} passenger${
          adults + children + infants > 1 ? "s" : ""
        }`}</Button>
        <Button
          size={SIZE.compact}
          kind={KIND.tertiary}
          endEnhancer={() => <IconChevronDown size={16} />}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                flex: "0 0 auto",
                whiteSpace: "nowrap",
                border: `1px solid ${$theme.colors.primary200}`,
                marginRight: $theme.sizing.scale200,
              }),
            },
          }}
        >
          {travelClass}
        </Button>
      </Block>
    </hgroup>
  );
}
