import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  setOrigin,
  setDestination,
  setDates,
  setTravelClass,
} from "../utils/slices/flightSlice";

// Condor
import { useCondor } from "../utils/CondorProvider";

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

// Icons
import { IconSearch } from "@tabler/icons-react";

// Components
import Locations from "./Locations";
import Calendar from "./Calendar";
import { CalendarFooter } from "./Calendar";
import Passengers from "./Passengers";
import Status from "./Status";

const selectTotalPassengers = (state) =>
  state.flight.passengers.adults +
  state.flight.passengers.children +
  state.flight.passengers.infants;

export default function FlightSearch() {
  // State
  const buttonValues = ["Business", "First", "Premium", "Economy"];

  const [status, setStatus] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Redux
  const dispatch = useDispatch();
  const origin = useSelector((state) => state.flight.origin);
  const destination = useSelector((state) => state.flight.destination);
  const dates = useSelector((state) => state.flight.dates);
  const travelClass = useSelector((state) => state.flight.travelClass);
  const totalPassengers = useSelector(selectTotalPassengers);

  const [selected, setSelected] = useState(buttonValues.indexOf(travelClass));
  useEffect(() => {
    setSelected(buttonValues.indexOf(travelClass));
  }, [travelClass]);

  const { openModal, closeModal } = useCondor();

  const handleOriginDrawer = () => {
    const title = "Where from?";
    const callbacks = {
      onChange: (selectedLocation) => {
        dispatch(setOrigin(selectedLocation));
        closeModal();
      },
    };
    const content = <Locations onChange={callbacks.onChange} />;

    openModal(title, content, null, callbacks);
  };

  const handleDestinationDrawer = () => {
    const title = "Where to?";
    const callbacks = {
      onChange: (selectedLocation) => {
        dispatch(setDestination(selectedLocation));
        closeModal();
      },
    };
    const content = <Locations onChange={callbacks.onChange} />;

    openModal(title, content, null, callbacks);
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

    openModal(title, content, footer, callbacks);
  };

  const handlePassengerDrawer = () => {
    const title = "Who's travelling?";
    const callbacks = {};
    const content = <Passengers onChange={callbacks.onChange} />;

    openModal(title, content, null, callbacks);
  };

  const handleStatusDrawer = () => {
    const title = "Frequent flyer status";
    const callbacks = {};
    const content = <Status onChange={callbacks.onChange} />;

    openModal(title, content, null, callbacks);
  };

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    router.push("/flights/results");
  };

  console.log(origin.name);

  return (
    <section>
      <ButtonGroup
        selected={selected}
        size={SIZE.mini}
        shape={SHAPE.pill}
        mode={MODE.radio}
        onClick={(_event, index) => {
          setSelected(index);
          dispatch(setTravelClass(buttonValues[index]));
        }}
        overrides={{
          Root: {
            style: ({ $theme }) => ({
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
        <Cell span={[4, 8, 12]}>
          {errorMessage && <div>{errorMessage}</div>}
        </Cell>
        <Cell span={[4, 2, 4]}>
          <InputText
            label="From"
            value={`${origin.airport}${origin.iata ? ` (${origin.iata})` : ""}`}
            placeholder="City or airport"
            subText={`${origin.name}, ${origin.country}`}
            onClick={handleOriginDrawer}
          />
        </Cell>
        <Cell span={[4, 2, 4]}>
          <InputText
            label="To"
            value={`${destination.airport}${
              destination.iata ? ` (${destination.iata})` : ""
            }`}
            placeholder="City or airport"
            subText={
              `${destination.name}, ${destination.country}` ||
              "Any worldwide airport"
            }
            onClick={handleDestinationDrawer}
          />
        </Cell>
        <Cell span={[2, 2, 2]}>
          <InputDatePick
            label="Departure"
            value={dates.outbound}
            placeholder="+ Add date"
            onClick={handleCalendarDrawer}
          />
        </Cell>
        <Cell span={[2, 2, 2]}>
          <InputDatePick
            label="Return"
            value={dates.inbound}
            placeholder="+ Add date"
            onClick={handleCalendarDrawer}
          />
        </Cell>
      </Grid>
      <Grid gridGaps={[0]} gridGutters={[12, 6, 12]} gridMargins={[0]}>
        <Cell span={[4, 1, 2]}>
          <InputPersons
            label="Passengers"
            passengers={totalPassengers}
            onClick={handlePassengerDrawer}
          />
        </Cell>
        <Cell span={[4, 5, 7]}>
          <InputStatus
            label="Frequent Flyer"
            status={status}
            onClick={handleStatusDrawer}
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
