import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Base Web
import { Grid, Cell } from "baseui/layout-grid";
import { Button } from "baseui/button";
import { ButtonGroup, MODE, SIZE, SHAPE } from "baseui/button-group";

// Primitives
import {
  InputText,
  InputDatePick,
  InputPersons,
  InputStatus,
} from "../primitives/input";

// Components
import Locations from "./Locations";
import Calendar, { CalendarFooter } from "./Calendar";
import Passengers from "./Passengers";
import Status from "./Status";

// Icons
import { IconSearch } from "@tabler/icons-react";

// Layer
import { useLayer } from "../../contexts/LayerProvider";
import { useFlights } from "@/contexts/FlightsProvider";

// Store
import { useDispatch, useSelector } from "react-redux";
import {
  setOrigin,
  setDestination,
  setDates,
  setTravelClass,
} from "../utils/store/slices/flightSlice";

// Helpers
import { getTotalPassengers } from "../utils/helpers/passengerUtils";

export default function FlightSearch() {
  // Provider Functions
  const { openLayer, closeLayer } = useLayer();
  const { clearFlightSearchData } = useFlights();
  const router = useRouter();

  // Values
  const classButtonValues = ["Business", "First", "Premium", "Economy"];

  // Store
  const dispatch = useDispatch();
  const origin = useSelector((state) => state.flight.origin);
  const destination = useSelector((state) => state.flight.destination);
  const dates = useSelector((state) => state.flight.dates);
  const travelClass = useSelector((state) => state.flight.travelClass);
  const totalPassengers = useSelector(getTotalPassengers);
  const loyaltyPrograms = useSelector((state) => state.flight.loyaltyPrograms);

  const loyaltyProgramsCount = loyaltyPrograms.length;

  const [selected, setSelected] = useState(
    classButtonValues.indexOf(travelClass) !== -1
      ? classButtonValues.indexOf(travelClass)
      : 0
  );

  useEffect(() => {
    setSelected(classButtonValues.indexOf(travelClass));
  }, [travelClass]);

  // Handlers
  const handleOriginLayer = () => {
    const title = "Where from?";
    const callbacks = {
      onChange: (selectedLocation) => {
        dispatch(setOrigin(selectedLocation));
        closeLayer();
      },
    };
    const content = <Locations onChange={callbacks.onChange} mode="origin" />;

    openLayer(title, content, null, callbacks);
  };

  const handleDestinationLayer = () => {
    const title = "Where to?";
    const callbacks = {
      onChange: (selectedLocation) => {
        dispatch(setDestination(selectedLocation));
        closeLayer();
      },
    };
    const content = (
      <Locations onChange={callbacks.onChange} mode="destination" />
    );

    openLayer(title, content, null, callbacks);
  };

  const handleCalendarLayer = () => {
    const title = "Choose your dates";
    const callbacks = {
      onChange: (selectedDates) => {
        dispatch(setDates(selectedDates));
        closeLayer();
      },
    };
    const content = <Calendar onChange={callbacks.onChange} />;
    const footer = <CalendarFooter />;

    openLayer(title, content, footer, callbacks);
  };

  const handlePassengerLayer = () => {
    const title = "Who's travelling?";
    const callbacks = {};
    const content = <Passengers onChange={callbacks.onChange} />;

    openLayer(title, content, null, callbacks);
  };

  const handleStatusLayer = () => {
    const title = "Frequent flyer status";
    const callbacks = {};
    const content = <Status onChange={callbacks.onChange} />;

    openLayer(title, content, null, callbacks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearFlightSearchData();
    router.push("/flights/results");
  };

  return (
    <section>
      <ButtonGroup
        selected={selected}
        size={SIZE.compact}
        shape={SHAPE.pill}
        mode={MODE.radio}
        onClick={(_event, index) => {
          setSelected(index);
          dispatch(setTravelClass(classButtonValues[index]));
        }}
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              marginBottom: $theme.sizing.scale600,
              overflowX: "auto visible",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }),
          },
        }}
      >
        <Button key="business">Business</Button>
        <Button key="first">First</Button>
        <Button key="premium_economy">Premium</Button>
        <Button key="economy">Economy</Button>
      </ButtonGroup>

      <Grid gridGaps={[12, 6, 12]} gridGutters={[12, 6, 12]} gridMargins={[0]}>
        <Cell span={[4, 2, 4]}>
          <InputText
            label="From"
            value={`${origin?.name}${
              origin?.name ? ` (${origin?.iata_code})` : ""
            }`}
            placeholder="City or airport"
            subText={`${origin?.city_name ? origin?.city_name : origin?.name}`}
            onClick={handleOriginLayer}
          />
        </Cell>
        <Cell span={[4, 2, 4]}>
          <InputText
            label="To"
            value={`${destination?.name}${
              destination?.name ? ` (${destination?.iata_code})` : ""
            }`}
            placeholder="City or airport"
            subText={
              destination?.city_name
                ? destination.city_name
                : destination?.name
                ? destination.name
                : "Add destination"
            }
            onClick={handleDestinationLayer}
          />
        </Cell>
        <Cell span={[2, 2, 2]}>
          <InputDatePick
            label="Departure"
            value={dates.outbound}
            placeholder="+ Add date"
            onClick={handleCalendarLayer}
          />
        </Cell>
        <Cell span={[2, 2, 2]}>
          <InputDatePick
            label="Return"
            value={dates.inbound}
            placeholder="+ Add date"
            onClick={handleCalendarLayer}
          />
        </Cell>
      </Grid>
      <Grid gridGaps={[0]} gridGutters={[12, 6, 12]} gridMargins={[0]}>
        <Cell span={[4, 1, 2]}>
          <InputPersons
            label="Passengers"
            passengers={totalPassengers}
            onClick={handlePassengerLayer}
          />
        </Cell>
        <Cell span={[4, 5, 7]}>
          <InputStatus
            label="Frequent Flyer"
            onClick={handleStatusLayer}
            loyaltyProgramsCount={loyaltyProgramsCount}
          />
        </Cell>
        <Cell span={[4, 2, 3]}>
          <Button
            size={SIZE.large}
            startEnhancer={<IconSearch size={18} />}
            onClick={handleSubmit}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: "100%",
                  marginTop: $theme.sizing.scale800,
                }),
              },
            }}
          >
            Find flights
          </Button>
        </Cell>
      </Grid>
    </section>
  );
}
