import React, { useState } from "react";

// Base Web
import { Grid, Cell } from "baseui/layout-grid";
import { Button } from "baseui/button";
import { Block } from "baseui/block";
import { ListItem, ListItemLabel } from "baseui/list";
import { Checkbox, STYLE_TYPE, LABEL_PLACEMENT } from "baseui/checkbox";
import { Card } from "baseui/card";
import { HeadingMedium, LabelSmall } from "baseui/typography";
import { styled } from "baseui";
import { useStyletron } from "baseui";

// Components
import UtilityDrawer from "../elements/global/UtilityDrawer";
import DrawerLocationsOrigin from "../elements/flights/DrawerLocationsOrigin";

// Custom UI
import { InputFloating } from "../ui/input";
import { LeftCard } from "../ui/card";

// Tabler Icons
import {
  IconPlaneDeparture,
  IconPlaneArrival,
  IconArrowsTransferDown,
  IconCalendar,
  IconVip,
  IconUsers,
} from "@tabler/icons-react";

// Custom Components
const DashedLine = styled(Block, ({ $theme }) => ({
  position: "absolute",
  top: "25%",
  bottom: "0",
  left: "33px",
  marginLeft: "-1px",
  borderLeft: `1px dashed ${$theme.colors.primary500}`,
  height: "50%",
}));

export default function FlightTabs({ key }) {
  const [css, theme] = useStyletron();
  const [selected, setSelected] = useState(0);
  const [formVisible, setFormVisible] = useState(true);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [returnToggle, setReturnToggle] = useState(false);
  const initialState = { [key]: false };
  const [isOpen, setIsOpen] = useState(initialState);
  const [drawerContent, setDrawerContent] = useState(null);

  const openDrawer = (content) => {
    setDrawerContent(content);
    setIsOpen((prevOpen) => ({ ...prevOpen, [key]: true }));
  };

  const closeDrawer = () => {
    setIsOpen((prevOpen) => ({ ...prevOpen, [key]: false }));
  };

  const renderComponent = () => {
    switch (selected) {
      case 0:
        return (
          <div>
            <FlightTabs />
          </div>
        );
      case 1:
        return <div></div>;
      default:
        return null;
    }
  };

  const marginLeftClass = css({
    marginLeft: theme.sizing.scale600,
  });

  const handleClick = () => {
    setFormVisible(!formVisible);
    setDetailsVisible(!detailsVisible);
  };

  return (
    <section>
      {formVisible && (
        <Grid>
          <Cell span={[4]}>
            <InputFloating
              label="From"
              icon={<IconPlaneDeparture size={16} />}
              placeholder="London Heathrow, LHR"
              onClick={() => openDrawer(<DrawerLocationsOrigin />)}
            />
            <InputFloating
              label="To"
              icon={<IconPlaneArrival size={16} />}
              placeholder="Where to?"
            />
            <Button
              onClick={handleClick}
              overrides={{ BaseButton: { style: { width: "100%" } } }}
            >
              Lets Go
            </Button>
          </Cell>
        </Grid>
      )}

      {detailsVisible && (
        <Block>
          <Grid>
            <Cell span={[2]}>
              <IconPlaneDeparture size={24} />
              <HeadingMedium
                overrides={{
                  Block: {
                    style: {
                      margin: 0, // Remove the padding
                    },
                  },
                }}
              >
                LHR
              </HeadingMedium>
              <LabelSmall>London Heathrow</LabelSmall>
            </Cell>
            <Cell span={[2]}>
              <Block
                overrides={{
                  Block: {
                    style: {
                      textAlign: "right",
                    },
                  },
                }}
              >
                <IconPlaneArrival size={24} />
                <HeadingMedium
                  overrides={{
                    Block: {
                      style: {
                        margin: 0, // Remove the padding
                      },
                    },
                  }}
                >
                  CAN
                </HeadingMedium>
                <LabelSmall>Guangzhou Baiyun</LabelSmall>
              </Block>
            </Cell>
          </Grid>
          <Grid>
            <Cell span={[4]}>
              <LeftCard heading="Flight details">
                <Block
                  overrides={{
                    Block: {
                      style: ({ $theme }) => ({
                        backgroundColor: $theme.colors.primary100,
                        borderTopRightRadius: $theme.borders.radius500,
                        borderBottomRightRadius: $theme.borders.radius500,
                      }),
                    },
                  }}
                >
                  <ListItem
                    overrides={{
                      Root: {
                        style: ({ $theme }) => ({
                          backgroundColor: "none",
                        }),
                      },
                      Content: {
                        style: ({ $theme }) => ({
                          borderBottom: 0,
                        }),
                      },
                    }}
                    artwork={(props) => <IconArrowsTransferDown size={24} />}
                    endEnhancer={() => (
                      <Checkbox
                        checked={returnToggle}
                        checkmarkType={STYLE_TYPE.toggle_round}
                        onChange={(e) => setReturnToggle(e.target.checked)}
                        labelPlacement={LABEL_PLACEMENT.right}
                      />
                    )}
                  >
                    <ListItemLabel>Return trip?</ListItemLabel>
                  </ListItem>
                </Block>

                {returnToggle ? (
                  <div style={{ position: "relative" }}>
                    <DashedLine />
                    <Block>
                      <ListItem
                        overrides={{
                          Root: {
                            style: ({ $theme }) => ({
                              backgroundColor: "none",
                            }),
                          },
                        }}
                        artwork={(props) => <IconCalendar size={24} />}
                      >
                        <ListItemLabel description="Departure">
                          21st July
                        </ListItemLabel>
                      </ListItem>
                    </Block>
                    <Block>
                      <ListItem
                        overrides={{
                          Root: {
                            style: ({ $theme }) => ({
                              backgroundColor: "none",
                            }),
                          },
                        }}
                        artwork={(props) => <IconCalendar size={24} />}
                      >
                        <ListItemLabel description="Return">
                          28th July
                        </ListItemLabel>
                      </ListItem>
                    </Block>
                  </div>
                ) : (
                  <ListItem
                    overrides={{
                      Root: {
                        style: ({ $theme }) => ({
                          backgroundColor: "none",
                        }),
                      },
                    }}
                    artwork={(props) => <IconCalendar size={24} />}
                  >
                    <ListItemLabel description="Departure">
                      21st July
                    </ListItemLabel>
                  </ListItem>
                )}

                <ListItem
                  overrides={{
                    Root: {
                      style: ({ $theme }) => ({
                        backgroundColor: "none",
                      }),
                    },
                  }}
                  artwork={(props) => <IconVip size={24} />}
                >
                  <ListItemLabel description="Frequent Flyer">
                    British Airways + 2 others
                  </ListItemLabel>
                </ListItem>

                <ListItem
                  overrides={{
                    Root: {
                      style: ({ $theme }) => ({
                        backgroundColor: "none",
                      }),
                    },
                  }}
                  artwork={(props) => <IconUsers size={24} />}
                >
                  <ListItemLabel description="Passengers">
                    2 Adults, 1 Child
                  </ListItemLabel>
                </ListItem>
              </LeftCard>

              <Button
                onClick={handleClick}
                overrides={{ BaseButton: { style: { width: "100%" } } }}
              >
                Find Flights
              </Button>
            </Cell>
          </Grid>
        </Block>
      )}
      <UtilityDrawer isOpen={isOpen[key]} onClose={closeDrawer}>
        {drawerContent}
      </UtilityDrawer>
    </section>
  );
}
