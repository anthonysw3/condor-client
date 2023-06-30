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

// Providers
import { useCondor } from "../utils/providers/CondorProvider";

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
  const { openModal, closeModal } = useCondor();
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

  const [selected, setSelected] = useState(
    classButtonValues.indexOf(travelClass)
  );

  useEffect(() => {
    setSelected(classButtonValues.indexOf(travelClass));
  }, [travelClass]);

  // Handlers
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

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/flights/results");
  };

  return (
    <section>
      <ButtonGroup
        selected={selected}
        size={SIZE.mini}
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
              destination.name
                ? `${destination.name}, ${destination.country}`
                : "Any worldwide airport"
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
          <InputStatus label="Frequent Flyer" onClick={handleStatusDrawer} />
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
