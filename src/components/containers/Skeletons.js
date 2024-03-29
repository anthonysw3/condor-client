import React from "react";

// Base Web
import { Block } from "baseui/block";
import { Skeleton } from "baseui/skeleton";

// Primitives
import { List } from "../primitives/list";
import { Panel } from "../containers/Panel";

export function FlightResultSkeleton() {
  return (
    <Panel>
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginBottom: $theme.sizing.scale800,
            }),
          },
        }}
      >
        <Skeleton
          rows={2}
          width="200px"
          overrides={{
            Row: {
              style: {
                height: "10px",
                marginBottom: "5px",
              },
            },
          }}
          animation
        />
      </Block>
      <Skeleton
        rows={2}
        width="100%"
        overrides={{
          Row: {
            style: {
              height: "20px",
              marginBottom: "5px",
            },
          },
        }}
        animation
      />
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale700,
            }),
          },
        }}
      >
        <Skeleton
          height="40px"
          width="70px"
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale500,
                marginBottom: 0,
              }),
            },
          }}
          animation
        />
        <Skeleton
          height="40px"
          width="90px"
          animation
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale500,
                marginBottom: 0,
                borderRadius: $theme.borders.radius200,
              }),
            },
          }}
        />
        <Skeleton
          height="40px"
          width="90px"
          animation
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale500,
                marginBottom: 0,
                borderRadius: $theme.borders.radius200,
              }),
            },
          }}
        />
        <Skeleton
          height="40px"
          width="90px"
          animation
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale500,
                marginBottom: 0,
                borderRadius: $theme.borders.radius200,
              }),
            },
          }}
        />
      </Block>
    </Panel>
  );
}

export function FlightSummarySkeleton() {
  return (
    <Panel>
      <Skeleton
        rows={2}
        width="200px"
        overrides={{
          Row: {
            style: {
              height: "20px",
              marginBottom: "10px",
            },
          },
        }}
        animation
      />
      <Skeleton
        width="100%"
        height="40px"
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale900,
              marginBottom: $theme.sizing.scale900,
            }),
          },
        }}
        animation
      />
      <Skeleton
        width="100%"
        height="40px"
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale900,
              marginBottom: $theme.sizing.scale900,
            }),
          },
        }}
        animation
      />
      <Skeleton
        rows={2}
        width="200px"
        overrides={{
          Row: {
            style: {
              height: "20px",
              marginBottom: "10px",
            },
          },
        }}
        animation
      />
    </Panel>
  );
}

export function ListSkeleton() {
  return (
    <List
      label={
        <Block display="flex" justifyContent="flex-start" alignItems="center">
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({ marginRight: "10px" }),
              },
            }}
          >
            <Skeleton height="22px" width="22px" animation />
          </Block>
          <Skeleton height="22px" width="180px" animation />
        </Block>
      }
      listEnd={<Skeleton height="22px" width="80px" animation />}
    />
  );
}
