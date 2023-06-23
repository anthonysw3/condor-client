import React, { useState } from "react";

// Base Web
import { Block } from "baseui/block";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { LabelXSmall, MonoLabelLarge } from "baseui/typography";
import { Notification } from "baseui/notification";
import { Card, StyledBody } from "baseui/card";

// Icons
import { IconChevronDown, IconChevronUp, IconPlane } from "@tabler/icons-react";

// Components
import FlightSegment from "./FlightSegment";

export default function FlightSliceDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <article>
      <Block
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale300,
              paddingLeft: "24px",
              paddingRight: "24px",
            }),
          },
        }}
      >
        <Card
          width="100%"
          overrides={{
            Root: {
              style: ({ $theme }) => ({
                cursor: "pointer",
                marginTop: $theme.sizing.scale600,
              }),
            },
          }}
        >
          <StyledBody>
            <Block onClick={handleToggle}>
              <Badge
                hierarchy={HIERARCHY.secondary}
                color={COLOR.primary}
                content="British Airways"
              ></Badge>
              <FlexGrid
                flexGridColumnCount={3}
                flexGridColumnGap="scale100"
                flexGridRowGap="scale100"
              >
                <FlexGridItem>
                  <MonoLabelLarge
                    overrides={{
                      Block: {
                        style: ({ $theme }) => ({
                          marginTop: $theme.sizing.scale500,
                          marginBottom: 0,
                          display: "flex",
                        }),
                      },
                    }}
                  >
                    CAN
                  </MonoLabelLarge>
                  <LabelXSmall>22 Jun</LabelXSmall>
                  <LabelXSmall>Guangzhou, China</LabelXSmall>
                </FlexGridItem>
                <FlexGridItem
                  width="600px"
                  alignContent="center"
                  justifyContent="center"
                >
                  <Block
                    display="flex"
                    justifyContent="center"
                    overrides={{
                      Block: {
                        style: ({ $theme }) => ({
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          height: "1px",
                          background: `linear-gradient(to right, transparent, ${$theme.colors.primary300}, transparent)`,
                          marginBlockStart: $theme.sizing.scale700,
                          marginBlockEnd: "8px",
                        }),
                      },
                    }}
                  >
                    <IconPlane size={16} />
                  </Block>
                  <Block display="flex" justifyContent="center">
                    <Badge
                      hierarchy={HIERARCHY.secondary}
                      color={COLOR.primary}
                      content="14hrs 30mins"
                      overrides={{
                        Badge: {
                          style: ({ $theme }) => ({
                            fontSize:
                              $theme.typography.ParagraphXSmall.fontSize,
                          }),
                        },
                      }}
                    />
                  </Block>
                  <Block
                    display="flex"
                    justifyContent="center"
                    marginTop="scale400"
                  >
                    {isOpen ? (
                      <IconChevronUp size={24} />
                    ) : (
                      <IconChevronDown size={24} />
                    )}
                  </Block>
                </FlexGridItem>
                <FlexGridItem>
                  <MonoLabelLarge
                    overrides={{
                      Block: {
                        style: ({ $theme }) => ({
                          marginTop: $theme.sizing.scale500,
                          marginBottom: 0,
                          display: "flex",
                          alignItems: "right",
                          justifyContent: "right",
                        }),
                      },
                    }}
                  >
                    LHR
                  </MonoLabelLarge>
                  <LabelXSmall
                    overrides={{
                      Block: {
                        style: {
                          textAlign: "right",
                        },
                      },
                    }}
                  >
                    23 Jun
                  </LabelXSmall>
                  <LabelXSmall
                    overrides={{
                      Block: {
                        style: {
                          textAlign: "right",
                        },
                      },
                    }}
                  >
                    London, UK
                  </LabelXSmall>
                </FlexGridItem>
              </FlexGrid>
            </Block>
            {isOpen && (
              <Block>
                <FlightSegment />
                <Notification>
                  <small>
                    <strong>4hr 45mins</strong> &bull; transit in Guangzhou
                    (CAN)
                  </small>
                </Notification>
                <FlightSegment />
              </Block>
            )}
          </StyledBody>
        </Card>
      </Block>
    </article>
  );
}
