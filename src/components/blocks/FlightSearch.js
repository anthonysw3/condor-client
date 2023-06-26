import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  setOriginAirport,
  setOriginName,
  setOriginIata,
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
import { IconSearch, IconPlus } from "@tabler/icons-react";

// Components
import Locations from "./Locations";
import Calendar from "./Calendar";
import Passengers from "./Passengers";
import Status from "./Status";

const selectTotalPassengers = (state) =>
  state.flight.passengers.adults +
  state.flight.passengers.children +
  state.flight.passengers.infants;

export default function FlightSearch() {
  // State
  const buttonValues = ["Business", "First", "Premium", "Economy"];
  const travelClass = useSelector((state) => state.flight.travelClass);
  const [selected, setSelected] = useState(buttonValues.indexOf(travelClass));
  const [status, setStatus] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setSelected(buttonValues.indexOf(travelClass));
  }, [travelClass]);

  const dispatch = useDispatch();
  const originAirport = useSelector((state) => state.flight.origin_airport);
  const originName = useSelector((state) => state.flight.origin_name);
  const originIata = useSelector((state) => state.flight.origin_iata);
  const destinationAirport = useSelector(
    (state) => state.flight.destination_airport
  );
  const destinationName = useSelector((state) => state.flight.destination_name);
  const destinationIata = useSelector((state) => state.flight.destination_iata);

  const outboundDate = useSelector((state) => state.flight.dates.outbound);

  const totalPassengers = useSelector(selectTotalPassengers);

  const { openModal } = useCondor();

  const handleOriginDrawer = () => {
    const title = "Where from?";
    const callbacks = {
      onChange: (event) =>
        dispatch(setOriginAirport(event.target.origin_airport.value)),
    };
    const content = <Locations onChange={callbacks.onChange} flights origin />;

    openModal(title, content, callbacks);
  };

  const handleDestinationDrawer = () => {
    const title = "Where to?";
    const callbacks = {
      onChange: (event) =>
        dispatch(setDestinationAirport(event.target.destination_airport.value)),
    };
    const content = <Locations onChange={callbacks.onChange} flights origin />;

    openModal(title, content, callbacks);
  };

  const handleCalendarDrawer = () => {
    const title = "Choose your dates";
    const callbacks = {};
    const content = <Calendar onChange={callbacks.onChange} />;

    openModal(title, content, callbacks);
  };

  const handlePassengerDrawer = () => {
    const title = "Who's travelling?";
    const callbacks = {};
    const content = <Passengers onChange={callbacks.onChange} />;

    openModal(title, content, callbacks);
  };

  const handleStatusDrawer = () => {
    const title = "Frequent flyer status";
    const callbacks = {};
    const content = <Status onChange={callbacks.onChange} />;

    openModal(title, content, callbacks);
  };

  // const origin = originIata;
  // const destination = destinationIata;
  // const date = outboundDate;
  // const returnDate = "";
  // const cabinClass = travelClass;
  // const passengers = [];

  const origin = "CAN";
  const originDisplay = "Guangzhou";
  const destination = "PVG";
  const destinationDisplay = "Shanghai";
  const date = "2023-09-05";
  const returnDate = "2023-09-15";
  const cabinClass = "business";
  const passengers = {
    adults: 1,
    children: 0,
    infants: 0,
  };

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message on new submission

    const queryParams = {
      origin,
      originDisplay,
      destination,
      destinationDisplay,
      date,
      returnDate,
      cabinClass,
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
    };

    const queryString = new URLSearchParams(queryParams).toString();

    router.push(`/flights/results?${queryString}`);
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
        <Button>Business</Button>
        <Button>First</Button>
        <Button>Premium</Button>
        <Button>Economy</Button>
      </ButtonGroup>

      <Grid gridGaps={[12, 6, 12]} gridGutters={[12, 6, 12]} gridMargins={[0]}>
        <Cell span={[4, 8, 12]}>
          {errorMessage && <div>{errorMessage}</div>}
        </Cell>
        <Cell span={[4, 2, 4]}>
          <InputText
            label="From"
            value={`${originAirport}${originIata ? ` (${originIata})` : ""}`}
            placeholder="City or airport"
            subText={originName}
            onClick={handleOriginDrawer}
          />
        </Cell>
        <Cell span={[4, 2, 4]}>
          <InputText
            label="To"
            value={`${destinationAirport}${
              destinationIata ? ` (${destinationIata})` : ""
            }`}
            placeholder="City or airport"
            subText={destinationName || "Any worldwide airport"}
            onClick={handleDestinationDrawer}
          />
        </Cell>
        <Cell span={[2, 2, 2]}>
          <InputDatePick
            label="Departure"
            value={outboundDate}
            onClick={handleCalendarDrawer}
          />
        </Cell>
        <Cell span={[2, 2, 2]}>
          <InputDatePick label="Return" placeholder="+ Add date" />
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
