import React from "react";

// Grid
import { Container, Row, Col } from "react-grid-system";

// Base Web
import { Block } from "baseui/block";
import { LabelXSmall, LabelMedium } from "baseui/typography";
import { Skeleton } from "baseui/skeleton";
import { useStyletron } from "baseui";

import { useSelector } from "react-redux";

import { getCurrencySymbol } from "../utils/helpers/currencyUtils";

function SortingOption({
  method,
  sortingMethod,
  setSortingMethod,
  label,
  offer,
}) {
  const {
    passengers: { adults, children, infants },
  } = useSelector((state) => state.flight);

  const totalPassengers = adults + children + infants;

  return (
    <Col xs={4}>
      <Block
        onClick={() => setSortingMethod(method)}
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              margin: 0,
              padding: `${$theme.sizing.scale400}`,
              backgroundColor:
                sortingMethod === method
                  ? `${$theme.colors.primary50}`
                  : `${$theme.colors.backgroundPrimary}`,
              borderRadius: $theme.borders.radius300,
              ":hover": {
                backgroundColor: $theme.colors.primary100,
                cursor: "pointer",
              },
              ":active": {
                backgroundColor: $theme.colors.primary50,
              },
            }),
          },
        }}
      >
        <LabelXSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginBottom: $theme.sizing.scale100,
              }),
            },
          }}
        >
          {label}
        </LabelXSmall>
        <LabelMedium
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                fontWeight: "bold",
              }),
            },
          }}
        >
          {!offer && <Skeleton height="20px" width="50px" animation />}
          {getCurrencySymbol(offer && offer.total_currency)}
          {offer && Math.ceil(offer?.total_amount / totalPassengers)}
        </LabelMedium>
      </Block>
    </Col>
  );
}

export default function SortingOptions({
  setSortingMethod,
  sortingMethod,
  offersByBest,
  offersByPrice,
  offersByDuration,
}) {
  const [css, theme] = useStyletron();
  const methods = [
    { method: "best", label: "Best", offer: offersByBest[0] },
    { method: "price", label: "Lowest", offer: offersByPrice[0] },
    { method: "duration", label: "Fastest", offer: offersByDuration[0] },
  ];

  const handleSortingMethodChange = (method) => {
    setSortingMethod(method);
  };

  return (
    <Container
      style={{
        marginTop: theme.sizing.scale500,
        padding: theme.sizing.scale300,
        backgroundColor: theme.colors.backgroundPrimary,
        borderRadius: theme.borders.radius500,
        boxShadow: "0 6px 12px -6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Row nogutter>
        {methods.map(({ method, label, offer }) => (
          <SortingOption
            key={method}
            method={method}
            sortingMethod={sortingMethod}
            setSortingMethod={handleSortingMethodChange}
            label={label}
            offer={offer}
          />
        ))}
      </Row>
    </Container>
  );
}
