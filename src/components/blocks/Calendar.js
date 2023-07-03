import React, { useState, useEffect } from "react";

// Condor Components
import { useCondor } from "../utils/providers/CondorProvider";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setDates } from "../utils/store/slices/flightSlice";

// Base Web
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { LabelMedium, LabelSmall, LabelLarge } from "baseui/typography";

// Day.js
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

export default function Calendar() {
  const { outbound, inbound } = useSelector((state) => state.flight.dates);
  const dispatch = useDispatch();

  const startDate = dayjs().startOf("month");
  const currentDate = dayjs();

  const renderDayLabels = () => {
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    return days.map((day, index) => (
      <FlexGridItem
        key={index}
        flexBasis="0"
        flexGrow={1}
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              backgroundColor: $theme.colors.primaryB,
              textAlign: "center",
              marginTop: `-${$theme.sizing.scale700}`,
              paddingTop: $theme.sizing.scale600,
            }),
          },
        }}
      >
        <LabelMedium>{day}</LabelMedium>
      </FlexGridItem>
    ));
  };

  const [selectedDates, setSelectedDates] = useState([
    dayjs(outbound),
    dayjs(inbound),
  ]);

  const [nextSelection, setNextSelection] = useState("outbound");

  const handleDateSelect = (date) => {
    const isPast = date.isBefore(currentDate, "day");
    const isToday = date.isSame(currentDate, "day");
    if (isPast || isToday) {
      return; // Do not update selection for past or today's date
    }

    if (nextSelection === "outbound") {
      setSelectedDates([date, selectedDates[1]]);
      dispatch(
        setDates({
          outbound: date.format("YYYY-MM-DD"),
          inbound: selectedDates[1]?.format("YYYY-MM-DD"),
        })
      );
      setNextSelection("inbound");
    } else {
      if (date.isAfter(selectedDates[0])) {
        setSelectedDates([selectedDates[0], date]);
        dispatch(
          setDates({
            outbound: selectedDates[0].format("YYYY-MM-DD"),
            inbound: date.format("YYYY-MM-DD"),
          })
        );
      } else {
        setSelectedDates([date, selectedDates[0]]);
        dispatch(
          setDates({
            outbound: date.format("YYYY-MM-DD"),
            inbound: selectedDates[0].format("YYYY-MM-DD"),
          })
        );
      }
      setNextSelection("outbound");
    }
  };

  const isDateBetweenSelectedDates = (date) => {
    if (selectedDates.length < 2) {
      return false;
    }

    const [firstDate, secondDate] = selectedDates.sort((a, b) => a.diff(b));
    return date.isAfter(firstDate, "day") && date.isBefore(secondDate, "day");
  };

  const isDateAdjacentToSelectedDate = (date, index) => {
    const previousDate = index > 0 ? selectedDates[index - 1] : null;
    const nextDate =
      index < selectedDates.length - 1 ? selectedDates[index + 1] : null;

    const isAdjacentToPrevious =
      previousDate &&
      (previousDate.isSame(date.subtract(1, "day"), "day") ||
        previousDate.isSame(date, "day"));
    const isAdjacentToNext =
      nextDate &&
      (nextDate.isSame(date.add(1, "day"), "day") ||
        nextDate.isSame(date, "day"));

    return isAdjacentToPrevious || isAdjacentToNext;
  };

  const renderMonths = () => {
    const months = [];

    for (let i = 0; i < 12; i++) {
      const monthDate = startDate.add(i, "month");
      const monthName = monthDate.format("MMMM");
      const year = monthDate.format("YYYY");

      const monthHeader = <LabelMedium>{`${monthName} ${year}`}</LabelMedium>;

      const firstDayOfMonth = monthDate.startOf("month");
      const daysInMonth = monthDate.daysInMonth();
      const startDayIndex = (firstDayOfMonth.day() + 6) % 7;

      const days = [];

      for (let j = 0; j < startDayIndex; j++) {
        const emptyDay = (
          <FlexGridItem key={`empty-${j}`} flexBasis="0" flexGrow={1} />
        );
        days.push(emptyDay);
      }

      for (let j = 1; j <= daysInMonth; j++) {
        const date = monthDate.date(j);
        const isSelected = selectedDates.some((selectedDate) =>
          selectedDate.isSame(date, "day")
        );
        const isToday = date.isSame(currentDate, "day");
        const isBetween = isDateBetweenSelectedDates(date);
        const isPast = date.isBefore(currentDate, "day");

        const day = (
          <FlexGridItem
            id={date.format("YYYY-MM-DD")}
            key={j}
            flexBasis="0"
            flexGrow={1}
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: `calc(100% / 7)`,
                  aspectRatio: "1/1",
                  cursor: isPast || isToday ? "default" : "pointer",
                  borderRadius: "0",
                  borderBottomLeftRadius:
                    isBetween && isDateAdjacentToSelectedDate(date, j - 1)
                      ? "0"
                      : $theme.borders.radius300,
                  borderTopLeftRadius:
                    isBetween && isDateAdjacentToSelectedDate(date, j - 1)
                      ? "0"
                      : $theme.borders.radius300,
                  borderBottomRightRadius:
                    isBetween && isDateAdjacentToSelectedDate(date, j)
                      ? "0"
                      : $theme.borders.radius300,
                  borderTopRightRadius:
                    isBetween && isDateAdjacentToSelectedDate(date, j)
                      ? "0"
                      : $theme.borders.radius300,
                }),
              },
            }}
          >
            <Block
              onClick={() => handleDateSelect(date)}
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    aspectRatio: "1/1",
                    borderRadius: isBetween ? 0 : $theme.borders.radius300,
                    color: isSelected
                      ? $theme.colors.primary
                      : isPast
                      ? $theme.colors.primary300
                      : "inherit",
                    backgroundColor: isSelected
                      ? $theme.colors.primaryA
                      : isBetween
                      ? $theme.colors.primary50
                      : "inherit",
                    ":hover": {
                      backgroundColor: isPast
                        ? "inherit"
                        : $theme.colors.primary,
                      boxShadow: isPast
                        ? "none"
                        : `inset 0 0 0 1px ${$theme.colors.primary}`,
                      color: isSelected ? $theme.colors.primary : "inherit",
                    },
                  }),
                },
              }}
            >
              <LabelSmall
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      fontWeight: isToday ? "bold" : "normal",
                      color: isSelected
                        ? $theme.colors.primaryB
                        : isPast
                        ? $theme.colors.primary300
                        : $theme.colors.primary,
                      ":hover": {
                        color: isSelected
                          ? $theme.colors.primaryB
                          : $theme.colors.primaryB,
                      },
                    }),
                  },
                }}
              >
                {j}
              </LabelSmall>
            </Block>
          </FlexGridItem>
        );

        days.push(day);
      }

      const remainingDays = (7 - (days.length % 7)) % 7;
      for (let j = 0; j < remainingDays; j++) {
        const emptyDay = (
          <FlexGridItem
            key={`empty-${days.length + j}`}
            flexBasis="0"
            flexGrow={1}
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: `calc(100% / 7)`,
                  aspectRatio: "1/1",
                }),
              },
            }}
          />
        );
        days.push(emptyDay);
      }

      const monthCalendar = (
        <div key={i}>
          {monthHeader}
          <FlexGrid
            flexGridColumnCount={7}
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginBottom: $theme.sizing.scale800,
                  width: "100%",
                }),
              },
            }}
          >
            {days}
          </FlexGrid>
        </div>
      );

      months.push(monthCalendar);
    }

    return months;
  };

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const stickyElement = document.getElementById("sticky-element");
      const stickyElementRect = stickyElement.getBoundingClientRect();
      const initialPosition = stickyElementRect.top + window.pageYOffset;

      setIsSticky(window.pageYOffset >= initialPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Get the first selected date, default to today if none selected
    const firstSelectedDate = selectedDates[0] || currentDate;

    // Get the HTML element with the id of the first selected date
    const firstSelectedDateElement = document.getElementById(
      firstSelectedDate.format("YYYY-MM-DD")
    );

    // If the element exists, scroll to it
    if (firstSelectedDateElement) {
      firstSelectedDateElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  return (
    <Block
      id="sticky-container"
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            position: isSticky ? "sticky" : "static",
            top: 0,
            zIndex: 1,
          }),
        },
      }}
    >
      <FlexGrid
        id="sticky-element"
        flexGridColumnCount={7}
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              position: "sticky",
              top: "0",
              backgroundColor: $theme.colors.backgroundPrimary,
              zIndex: 1,
              borderBottom: `1px solid ${$theme.colors.primary200}`,
              paddingBottom: $theme.sizing.scale500,
              marginBottom: $theme.sizing.scale500,

              color: isSticky ? $theme.colors.primary : "inherit",
            }),
          },
        }}
      >
        {renderDayLabels()}
      </FlexGrid>
      {renderMonths()}
    </Block>
  );
}

export function CalendarFooter() {
  const { outbound, inbound } = useSelector((state) => state.flight.dates);
  const formatSelectedDate = (date) => {
    return date ? dayjs(date).format("ddd, D MMM") : "--";
  };
  const { closeModal } = useCondor();
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            marginBottom: $theme.sizing.scale800,
          }),
        },
      }}
    >
      <FlexGrid
        flexGridColumnCount={2}
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              paddingLeft: $theme.sizing.scale500,
              paddingRight: $theme.sizing.scale500,
              paddingTop: $theme.sizing.scale500,
              paddingBottom: $theme.sizing.scale500,
            }),
          },
        }}
      >
        <FlexGridItem>
          <LabelSmall
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  color: $theme.colors.primary500,
                  marginBottom: $theme.sizing.scale200,
                }),
              },
            }}
          >
            Depart
          </LabelSmall>
          <LabelLarge
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  fontWeight: "bold",
                }),
              },
            }}
          >
            {outbound ? formatSelectedDate(outbound) : "- -"}
          </LabelLarge>
        </FlexGridItem>
        <FlexGridItem>
          <LabelSmall
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  color: $theme.colors.primary500,
                  marginBottom: $theme.sizing.scale200,
                }),
              },
            }}
          >
            Return
          </LabelSmall>
          <LabelLarge
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  fontWeight: "bold",
                  color: !inbound ? $theme.colors.primary300 : "inherit",
                }),
              },
            }}
          >
            {inbound ? formatSelectedDate(inbound) : "- -"}
          </LabelLarge>
        </FlexGridItem>
      </FlexGrid>
      <Button
        onClick={closeModal}
        overrides={{
          BaseButton: {
            style: ({ $theme }) => ({
              width: "100%",
              marginTop: $theme.sizing.scale500,
            }),
          },
        }}
      >
        {inbound ? "Select these dates" : "Search one way"}
      </Button>
    </Block>
  );
}
