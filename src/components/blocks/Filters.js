import React, { useState, useContext, useEffect } from "react";

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
import { ListSkeleton } from "../containers/Skeletons";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  toggleOnlyWithStatus,
  toggleOnlyBuildStatus,
  toggleStopsDirect,
  toggleStopsOne,
  toggleStopsTwoPlus,
  setOriginDepartTimeRange,
  setDestinationDepartTimeRange,
  setDurationMax,
  setDurationMin,
  setSelectedDurationMax,
  setLayoverMax,
  setOriginAirports,
  toggleOriginAirport,
  setDestinationAirports,
  toggleDestinationAirport,
  setAlliances,
  toggleAlliance,
  setAirlines,
  toggleAirline,
} from "../utils/store/slices/flightSlice";

export default function Filters({ airlinesAndPrices = [] }) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.flight.filters);
  const dates = useSelector((state) => state.flight.dates);

  useEffect(() => {
    if (airlinesAndPrices.length > 0) {
      setIsLoading(false); // Set loading state to false when airlinesAndPrices is populated
    }
  }, [airlinesAndPrices]);

  console.log("Airlines and Prices:", airlinesAndPrices);

  const convertHourToTimeString = (hour) => {
    return `${String(hour).padStart(2, "0")}:00:00`;
  };

  // Updated handler for stops filter
  const updateStopsFilter = (stopValue) => {
    switch (stopValue) {
      case 0:
        dispatch(toggleStopsDirect());
        break;
      case 1:
        dispatch(toggleStopsOne());
        break;
      case 2:
        dispatch(toggleStopsTwoPlus());
        break;
      default:
        break;
    }
  };

  const handleSliderChange = (label, newValue) => {
    if (label === "Origin Departure Time") {
      dispatch(setOriginDepartTimeRange(newValue));
    } else if (label === "Destination Departure Time") {
      dispatch(setDestinationDepartTimeRange(newValue));
    }
  };

  const handleTotalDurationChange = (value) => {
    console.log("Received Value in Filters:", value);
    dispatch(setSelectedDurationMax(value));
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
                checked={filters.onlyWithStatus}
                onChange={() => dispatch(toggleOnlyWithStatus())}
                checkmarkType={STYLE_TYPE.toggle}
              />
            }
          />
          <List
            label="Status building airlines"
            listEnd={
              <Checkbox
                checked={filters.onlyBuildStatus}
                onChange={() => dispatch(toggleOnlyBuildStatus())}
                checkmarkType={STYLE_TYPE.toggle}
              />
            }
          />
        </Block>
        <Block>
          <List
            label={
              <Checkbox
                checked={filters.stops.includes(0)}
                onChange={() => updateStopsFilter(0)}
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
                onChange={() => updateStopsFilter(1)}
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
                onChange={() => updateStopsFilter(2)}
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
            <HourSlider
              label="Origin Departure Time"
              currentRange={filters.originDepartTimeRange}
              onValueChange={handleSliderChange}
            />
          </Block>
          {dates.inbound && (
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
              <HourSlider
                label="Destination Departure Time"
                currentRange={filters.destinationDepartTimeRange}
                onValueChange={handleSliderChange}
              />
            </Block>
          )}
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
              <DurationSlider
                label="Total duration"
                onFinalChange={handleTotalDurationChange}
                maxTime={filters.durationMax}
                minTime={filters.durationMin}
                persistedTime={filters.selectedDurationMax}
              />
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
              <DurationSlider
                label="Maximum layover"
                onFinalChange={handleTotalDurationChange}
              />
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
              <Checkbox checked="true" checkmarkType={STYLE_TYPE.toggle} />
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
                checked="true"
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
                checked="true"
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
                checked="true"
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
                checked="true"
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
                checked="true"
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
                checked="true"
                checkmarkType={STYLE_TYPE.toggle}
                onChange={(e) => setDepartReturn(e.target.checked)}
              />
            }
          />
          <List
            label="Star Alliance"
            listEnd={
              <Checkbox
                checked="true"
                checkmarkType={STYLE_TYPE.toggle}
                onChange={(e) => setDepartReturn(e.target.checked)}
              />
            }
          />
          <List
            label="SkyTeam"
            listEnd={
              <Checkbox
                checked="true"
                checkmarkType={STYLE_TYPE.toggle}
                onChange={(e) => setDepartReturn(e.target.checked)}
              />
            }
          />
          {isLoading ? (
            <Block>
              <ListSkeleton />
              <ListSkeleton />
              <ListSkeleton />
            </Block>
          ) : (
            airlinesAndPrices.map((airline) => (
              <List
                key={airline.iataCode}
                label={
                  <Checkbox
                    checked={filters.airlines.includes(airline.iataCode)}
                    onChange={() => dispatch(toggleAirline(airline.iataCode))}
                    labelPlacement={LABEL_PLACEMENT.right}
                  >
                    {airline.name}
                  </Checkbox>
                }
                listEnd={<LabelXSmall>From £{airline.minPrice}</LabelXSmall>}
              />
            ))
          )}
          <List
            label={
              <Checkbox
                checked="true"
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
                checked="true"
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
                checked="true"
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
                checked="true"
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
