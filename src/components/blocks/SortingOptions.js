import React from "react";

// Grid
import { Container, Row, Col } from "react-grid-system";

// Base Web
import { Block } from "baseui/block";
import { LabelXSmall, LabelMedium } from "baseui/typography";
import { Skeleton } from "baseui/skeleton";
import { useStyletron } from "baseui";

import { getCurrencySymbol } from "../utils/helpers/currencyUtils";

const SortingOption = ({
  method,
  sortingMethod,
  setSortingMethod,
  label,
  offer,
  totalPassengers,
}) => (
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

export default function SortingOptions({
  setSortingMethod,
  sortingMethod,
  firstBestOffer,
  firstCheapestOffer,
  firstFastestOffer,
  totalPassengers,
}) {
  const [css, theme] = useStyletron();
  const methods = [
    { method: "best", label: "Best", offer: firstBestOffer },
    { method: "price", label: "Lowest", offer: firstCheapestOffer },
    { method: "duration", label: "Fastest", offer: firstFastestOffer },
  ];

  const handleSortingMethodChange = (method) => {
    setSortingMethod(method);
  };

  return (
    <Container
      style={{
        marginTop: theme.sizing.scale700,
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
            totalPassengers={totalPassengers}
          />
        ))}
      </Row>
    </Container>
  );
}
