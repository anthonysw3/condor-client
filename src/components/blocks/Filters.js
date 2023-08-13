import React, { useState, useContext } from "react";

// Grid
import { Row, Col } from "react-grid-system";

// Base Web
import { Block } from "baseui/block";
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from "baseui/checkbox";
import { LabelXSmall, LabelSmall, LabelMedium } from "baseui/typography";

// Primitives
import { List } from "../primitives/list";
import HourSlider from "../primitives/HourSlider";
import DurationSlider from "../primitives/DurationSlider";

// Flight Provider
import { useFlights } from "../../contexts/FlightsProvider";

export default function Filters() {
  const [frequentFlyer, setFrequentFlyer] = useState(false);
  const [statusAirlines, setStatusAirlines] = useState(false);
  const [departReturn, setDepartReturn] = useState(false);
  const [oneWorld, setOneWorld] = useState(true);
  const [starAlliance, setStarAlliance] = useState(true);
  const [skyTeam, setSkyTeam] = useState(true);

  const { filters, updateFilter } = useFlights();
  const stops = filters.stops || defaultStops; // defaultStops should be defined as [0, 1, 2]

  const updateStopsFilter = (stopValue, isChecked) => {
    if (isChecked) {
      updateFilter("stops", [...filters.stops, stopValue]);
    } else {
      updateFilter(
        "stops",
        filters.stops.filter((stop) => stop !== stopValue)
      );
    }
  };

  return (
    <Row>
      <Col xs={12}>
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginBottom: $theme.sizing.scale600,
              }),
            },
          }}
        >
          <LabelMedium
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale600,
                  fontWeight: "bold",
                }),
              },
            }}
          >
            Frequent flyers
          </LabelMedium>
          <List
            label="Frequent flyer airlines"
            listEnd={
              <Checkbox
                checked={frequentFlyer}
                checkmarkType={STYLE_TYPE.toggle}
                onChange={(e) => setFrequentFlyer(e.target.checked)}
              />
            }
          />
          <List
            label="Status building airlines"
            listEnd={
              <Checkbox
                checked={statusAirlines}
                checkmarkType={STYLE_TYPE.toggle}
                onChange={(e) => setStatusAirlines(e.target.checked)}
              />
            }
          />
        </Block>
        <Block>
          <List
            label={
              <Checkbox
                checked={filters.stops.includes(0)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter("stops", [...filters.stops, 0]);
                  } else {
                    updateFilter(
                      "stops",
                      filters.stops.filter((stop) => stop !== 0)
                    );
                  }
                }}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                Direct
              </Checkbox>
            }
            listEnd={<LabelXSmall>from £1123</LabelXSmall>}
          />
          <List
            label={
              <Checkbox
                checked={filters.stops.includes(1)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter("stops", [...filters.stops, 1]);
                  } else {
                    updateFilter(
                      "stops",
                      filters.stops.filter((stop) => stop !== 1)
                    );
                  }
                }}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                1 stop
              </Checkbox>
            }
            listEnd={<LabelXSmall>from £1123</LabelXSmall>}
          />
          <List
            label={
              <Checkbox
                checked={filters.stops.includes(2)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFilter("stops", [...filters.stops, 2]);
                  } else {
                    updateFilter(
                      "stops",
                      filters.stops.filter((stop) => stop !== 2)
                    );
                  }
                }}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                2+ stops
              </Checkbox>
            }
            listEnd={<LabelXSmall>from £1123</LabelXSmall>}
          />
        </Block>

        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginBottom: $theme.sizing.scale600,
              }),
            },
          }}
        >
          <LabelMedium
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale600,
                  fontWeight: "bold",
                }),
              },
            }}
          >
            Departure times
          </LabelMedium>
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale400,
                }),
              },
            }}
          >
            <LabelSmall
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginBottom: $theme.sizing.scale300,
                  }),
                },
              }}
            >
              Outbound
            </LabelSmall>
            <HourSlider />
          </Block>
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale400,
                }),
              },
            }}
          >
            <LabelSmall
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginBottom: $theme.sizing.scale300,
                  }),
                },
              }}
            >
              Return
            </LabelSmall>
            <HourSlider />
          </Block>
        </Block>
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginBottom: $theme.sizing.scale600,
              }),
            },
          }}
        >
          <LabelMedium
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale600,
                  fontWeight: "bold",
                }),
              },
            }}
          >
            Duration
          </LabelMedium>
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale400,
                }),
              },
            }}
          >
            <Block
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginBottom: $theme.sizing.scale400,
                  }),
                },
              }}
            >
              <LabelSmall
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      marginBottom: $theme.sizing.scale300,
                    }),
                  },
                }}
              >
                Total duration
              </LabelSmall>
              <DurationSlider />
            </Block>
            <Block
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginBottom: $theme.sizing.scale400,
                  }),
                },
              }}
            >
              <LabelSmall
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      marginBottom: $theme.sizing.scale300,
                    }),
                  },
                }}
              >
                Maximum layover
              </LabelSmall>
              <DurationSlider />
            </Block>
          </Block>
        </Block>
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginBottom: $theme.sizing.scale600,
              }),
            },
          }}
        >
          <LabelMedium
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale600,
                  fontWeight: "bold",
                }),
              },
            }}
          >
            Airports
          </LabelMedium>
          <List
            label="Depart/return at same airports"
            listEnd={
              <Checkbox
                checked={departReturn}
                checkmarkType={STYLE_TYPE.toggle}
                onChange={(e) => setDepartReturn(e.target.checked)}
              />
            }
          />
          <LabelSmall
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale600,
                }),
              },
            }}
          >
            London
          </LabelSmall>
          <List
            label={
              <Checkbox
                checked={direct}
                onChange={(e) => setDirect(e.target.checked)}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                Heathrow
              </Checkbox>
            }
            listEnd={<LabelXSmall>LHR</LabelXSmall>}
          />
          <List
            label={
              <Checkbox
                checked={oneStop}
                onChange={(e) => setOneStop(e.target.checked)}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                Gatwick
              </Checkbox>
            }
            listEnd={<LabelXSmall>LGW</LabelXSmall>}
          />
          <List
            label={
              <Checkbox
                checked={twoPlus}
                onChange={(e) => setTwoPlus(e.target.checked)}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                London City
              </Checkbox>
            }
            listEnd={<LabelXSmall>LCY</LabelXSmall>}
          />
          <LabelSmall
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale600,
                }),
              },
            }}
          >
            Bangkok
          </LabelSmall>
          <List
            label={
              <Checkbox
                checked={direct}
                onChange={(e) => setDirect(e.target.checked)}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                Suvarnabhumi
              </Checkbox>
            }
            listEnd={<LabelXSmall>BKK</LabelXSmall>}
          />
          <List
            label={
              <Checkbox
                checked={oneStop}
                onChange={(e) => setOneStop(e.target.checked)}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                Don Mueang Intl
              </Checkbox>
            }
            listEnd={<LabelXSmall>DMK</LabelXSmall>}
          />
        </Block>
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginBottom: $theme.sizing.scale600,
              }),
            },
          }}
        >
          <LabelMedium
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale600,
                  fontWeight: "bold",
                }),
              },
            }}
          >
            Airlines
          </LabelMedium>
          <List
            label="OneWorld"
            listEnd={
              <Checkbox
                checked={oneWorld}
                checkmarkType={STYLE_TYPE.toggle}
                onChange={(e) => setDepartReturn(e.target.checked)}
              />
            }
          />
          <List
            label="Star Alliance"
            listEnd={
              <Checkbox
                checked={starAlliance}
                checkmarkType={STYLE_TYPE.toggle}
                onChange={(e) => setDepartReturn(e.target.checked)}
              />
            }
          />
          <List
            label="SkyTeam"
            listEnd={
              <Checkbox
                checked={skyTeam}
                checkmarkType={STYLE_TYPE.toggle}
                onChange={(e) => setDepartReturn(e.target.checked)}
              />
            }
          />
          <List
            label={
              <Checkbox
                checked={oneStop}
                onChange={(e) => setOneStop(e.target.checked)}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                British Airways
              </Checkbox>
            }
            listEnd={<LabelXSmall>From £962</LabelXSmall>}
          />
          <List
            label={
              <Checkbox
                checked={oneStop}
                onChange={(e) => setOneStop(e.target.checked)}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                Cathay Pacific
              </Checkbox>
            }
            listEnd={<LabelXSmall>From £1425</LabelXSmall>}
          />
          <List
            label={
              <Checkbox
                checked={oneStop}
                onChange={(e) => setOneStop(e.target.checked)}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                Virgin Atlantic
              </Checkbox>
            }
            listEnd={<LabelXSmall>From £3429</LabelXSmall>}
          />
          <List
            label={
              <Checkbox
                checked={oneStop}
                onChange={(e) => setOneStop(e.target.checked)}
                labelPlacement={LABEL_PLACEMENT.right}
              >
                Singapore Airlines
              </Checkbox>
            }
            listEnd={<LabelXSmall>From £1329</LabelXSmall>}
          />
        </Block>
      </Col>
    </Row>
  );
}
