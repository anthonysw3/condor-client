import React from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setPassengers } from "../utils/slices/flightSlice";

// Base Web
import { Block } from "baseui/block";
import { ParagraphXSmall } from "baseui/typography";

// Condor Components
import { List } from "../primitives/list";
import { Counter } from "../primitives/counter";

export default function Passengers() {
  const dispatch = useDispatch();
  const passengers = useSelector((state) => state.flight.passengers);

  return (
    <Block>
      <List
        label="Adults"
        listEnd={
          <Counter
            label="Adults"
            value={passengers.adults}
            min={1}
            onValueChange={(newValue) =>
              dispatch(
                setPassengers({
                  ...passengers,
                  adults: newValue,
                })
              )
            }
          />
        }
      />
      <List
        label="Children"
        listEnd={
          <Counter
            label="Children"
            value={passengers.children}
            onValueChange={(newValue) =>
              dispatch(
                setPassengers({
                  ...passengers,
                  children: newValue,
                })
              )
            }
          />
        }
      />
      <List
        label="Infants"
        listEnd={
          <Counter
            label="Infants"
            value={passengers.infants}
            onValueChange={(newValue) =>
              dispatch(
                setPassengers({
                  ...passengers,
                  infants: newValue,
                })
              )
            }
          />
        }
      />
      <ParagraphXSmall>
        This must be the age of the passenger on the date of travel. Airlines
        have regulations in place regarding passengers under 18 travelling
        alone. Please make sure you check the airline&apos;s policies before
        booking.
      </ParagraphXSmall>
      <ParagraphXSmall>
        Please note that some airlines also have additional policies on under 18
        passengers.
      </ParagraphXSmall>
    </Block>
  );
}
