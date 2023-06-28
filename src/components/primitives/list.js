import React from "react";
import { Block } from "baseui/block";
import { LabelSmall, ParagraphSmall } from "baseui/typography";

export const List = ({ icon, label, description, listEnd, onClick }) => {
  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            display: "flex",
            alignItems: "center",
            borderBottom: `1px solid ${$theme.colors.primary50}`,
            paddingLeft: $theme.sizing.scale100,
            paddingRight: $theme.sizing.scale100,
            marginBottom: $theme.sizing.scale500,
            paddingBottom: $theme.sizing.scale500,
          }),
          props: {
            onClick: onClick,
          },
        },
      }}
    >
      {icon && (
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginRight: $theme.sizing.scale700,
              }),
            },
          }}
        >
          {icon}
        </Block>
      )}
      <Block
        flex="1"
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginRight: $theme.sizing.scale500,
            }),
          },
        }}
      >
        <LabelSmall
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                margin: 0,
              }),
            },
          }}
        >
          {label}
        </LabelSmall>
        {description && (
          <Block
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginTop: $theme.sizing.scale100,
                }),
              },
            }}
          >
            <ParagraphSmall
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    margin: 0,
                    color: $theme.colors.contentSecondary,
                  }),
                },
              }}
            >
              {description}
            </ParagraphSmall>
          </Block>
        )}
      </Block>
      {listEnd && (
        <Block
          marginLeft="auto"
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginLeft: "auto",
              }),
            },
          }}
        >
          {listEnd}
        </Block>
      )}
    </Block>
  );
};
