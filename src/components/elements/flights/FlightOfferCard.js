import React, { useState } from "react";

// Base Web
import { Card, StyledBody } from "baseui/card";
import { Drawer, SIZE as DrawerSIZE, ANCHOR } from "baseui/drawer";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { Button, SIZE, SHAPE } from "baseui/button";
import { Grid, Cell } from "baseui/layout-grid";
import {
  MonoParagraphSmall,
  MonoParagraphXSmall,
  HeadingXSmall,
} from "baseui/typography";
import { Block } from "baseui/block";
import { useStyletron } from "baseui";

// Icons
import { IconPlane, IconPigMoney, IconChevronRight } from "@tabler/icons-react";

// Components
import UtilityDrawer from "../global/UtilityDrawer";
import FlightOfferDrawer from "./FlightOfferDrawer";
import FlightSlice from "./FlightSlice";

export default function FlightOfferCard({
  key,
  airline,
  origin,
  destination,
  departureTime,
  arrivalTime,
  duration,
  price,
}) {
  const [css, theme] = useStyletron();
  const initialState = { [key]: false };
  const [isOpen, setIsOpen] = useState(initialState);

  const openDrawer = () => {
    setIsOpen((prevOpen) => ({ ...prevOpen, [key]: true }));
  };

  const closeDrawer = () => {
    setIsOpen((prevOpen) => ({ ...prevOpen, [key]: false }));
  };
  return (
    <article>
      <Card
        width="100%"
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              cursor: "pointer",
              marginTop: $theme.sizing.scale600,
            }),
            props: {
              onClick: () => openDrawer(key),
            },
          },
        }}
      >
        <StyledBody>
          <Badge
            hierarchy={HIERARCHY.secondary}
            color={COLOR.primary}
            content="British Airways"
            overrides={{
              Badge: {
                style: {
                  marginTop: 0,
                },
              },
            }}
          ></Badge>

          <FlightSlice
            key="1"
            origin="CAN"
            destination="LHR"
            departure="16:20"
            arrival="05:45"
            duration="11h 25m"
          />
          <FlightSlice
            key="2"
            origin="LHR"
            destination="CAN"
            departure="21:00"
            arrival="07:50"
            duration="14h 20m"
          />
          <Grid
            gridMargins={0}
            overrides={{
              Grid: {
                style: ({ $theme }) => ({
                  marginTop: $theme.sizing.scale600,
                }),
              },
            }}
          >
            <Cell span={[1, 6]}>
              <HeadingXSmall
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      marginTop: theme.sizing.scale100,
                      marginBottom: 0,
                      display: "flex",
                      alignItems: "center",
                    }),
                  },
                }}
              >
                £348
                <Badge
                  color={COLOR.positive}
                  hierarchy={HIERARCHY.secondary}
                  content={<IconPigMoney size={12} />}
                  overrides={{ Badge: { style: { marginLeft: "8px" } } }}
                />
              </HeadingXSmall>
            </Cell>
            <Cell span={[3, 6]}>
              <Block display="flex" justifyContent="right">
                <Button
                  size={SIZE.compact}
                  shape={SHAPE.pill}
                  endEnhancer={<IconChevronRight size={16} />}
                >
                  Continue
                </Button>
              </Block>
            </Cell>
          </Grid>
        </StyledBody>
      </Card>
      <UtilityDrawer
        onClose={closeDrawer}
        isOpen={isOpen[key]}
        direction="right"
      >
        <FlightOfferDrawer />
      </UtilityDrawer>
    </article>
  );
}
