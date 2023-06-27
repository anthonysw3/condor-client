import React, { useState, useEffect } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setDates } from "../utils/slices/flightSlice";

// Base Web
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Block } from "baseui/block";
import { LabelMedium, LabelSmall } from "baseui/typography";

// Day.js
import dayjs from "dayjs";

const Calendar = () => {
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
              textAlign: "center",
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

  const handleDateSelect = (date) => {
    const isPast = date.isBefore(currentDate, "day");
    if (isPast) {
      return; // Do not update selection for past dates
    }

    const isAlreadySelected = selectedDates.some((selectedDate) =>
      selectedDate.isSame(date, "day")
    );

    if (isAlreadySelected) {
      setSelectedDates((prevSelectedDates) =>
        prevSelectedDates.filter(
          (selectedDate) => !selectedDate.isSame(date, "day")
        )
      );
    } else {
      setSelectedDates((prevSelectedDates) => {
        let newSelectedDates =
          prevSelectedDates.length >= 2
            ? [prevSelectedDates[1], date]
            : [...prevSelectedDates, date];

        // If we have two dates, sort them by proximity to current date.
        // The date closest to now will be the outbound date.
        if (newSelectedDates.length === 2) {
          newSelectedDates = newSelectedDates.sort(
            (a, b) => a.diff(currentDate) - b.diff(currentDate)
          );
        }

        // Dispatch an action to update the dates in your Redux store.
        dispatch(
          setDates({
            outbound: newSelectedDates[0].format("YYYY-MM-DD"),
            inbound: newSelectedDates[1]?.format("YYYY-MM-DD"),
          })
        );

        return newSelectedDates;
      });
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
                  cursor: isPast ? "default" : "pointer",
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
                    backgroundColor: isSelected
                      ? $theme.colors.primaryA
                      : isBetween
                      ? $theme.colors.primary100
                      : "inherit",
                    ":hover": {
                      backgroundColor: isPast
                        ? "inherit"
                        : $theme.colors.primary50,
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
                      fontWeight: isToday ? "bold" : "normal",
                      color: isSelected
                        ? $theme.colors.primaryB
                        : isPast
                        ? $theme.colors.primary300
                        : "inherit",
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

  return (
    <Block
      id="sticky-container"
      overrides={{
        Block: {
          style: {
            position: isSticky ? "sticky" : "static",
            top: 0,
            zIndex: 1,
          },
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
};

export default Calendar;
