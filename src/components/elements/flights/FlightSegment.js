import React from "react";

// Base Web
import { Block } from "baseui/block";
import { Badge, HIERARCHY, COLOR } from "baseui/badge";
import { ParagraphMedium, MonoLabelSmall } from "baseui/typography";
import { Button, KIND, SIZE } from "baseui/button";

// Icons
import {
  IconChevronDown,
  IconMoonFilled,
  IconWifi,
  IconArmchair,
  IconPlug,
  IconDeviceTv,
  IconToolsKitchen2,
} from "@tabler/icons-react";

// Components
import Steps from "../global/Steps";

export default function FlightSegment() {
  return (
    <article>
      <Block marginTop="scale700" display="flex">
        <Button
          kind={KIND.secondary}
          size={SIZE.mini}
          endEnhancer={() => <IconChevronDown size={12} />}
        >
          BA 278 &bull; Business &bull; <IconMoonFilled size={14} />{" "}
          <IconWifi size={14} /> <IconArmchair size={14} />{" "}
          <IconPlug size={14} /> <IconDeviceTv size={14} />{" "}
          <IconToolsKitchen2 size={12} />
        </Button>
      </Block>
      <Block
        display="grid"
        gridTemplateColumns="30px 1fr"
        gridTemplateRows="repeat(3, 1fr)"
        marginTop="scale300"
      >
        <Block
          gridRow="1 / span 3"
          gridColumn="1"
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale200,
              }),
            },
          }}
        >
          <Steps />
        </Block>
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                display: "flex",
              }),
            },
          }}
        >
          <MonoLabelSmall
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginTop: "5px",
                  marginBottom: 0,
                }),
              },
            }}
          >
            22:10
          </MonoLabelSmall>
          <MonoLabelSmall
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginTop: "5px",
                  marginBottom: 0,
                  marginLeft: $theme.sizing.scale500,
                }),
              },
            }}
          >
            CAN
          </MonoLabelSmall>
          <Block
            flex="1"
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginTop: 0,
                  marginBottom: 0,
                }),
              },
            }}
          >
            <ParagraphMedium
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: $theme.sizing.scale500,
                  }),
                },
              }}
            >
              Guangzhou
            </ParagraphMedium>
          </Block>
        </Block>
        <Block>
          <Badge
            hierarchy={HIERARCHY.secondary}
            color={COLOR.primary}
            content="14hrs 30mins"
            overrides={{
              Badge: {
                style: ({ $theme }) => ({
                  fontSize: $theme.typography.ParagraphXSmall.fontSize,
                  marginTop: $theme.sizing.scale100,
                }),
              },
            }}
          />
        </Block>
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                display: "flex",
                marginTop: $theme.sizing.scale100,
              }),
            },
          }}
        >
          <MonoLabelSmall
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginTop: "5px",
                  marginBottom: 0,
                }),
              },
            }}
          >
            05:45
          </MonoLabelSmall>
          <MonoLabelSmall
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginTop: "5px",
                  marginBottom: 0,
                  marginLeft: $theme.sizing.scale500,
                }),
              },
            }}
          >
            CAN
          </MonoLabelSmall>
          <Block
            flex="1"
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  marginTop: 0,
                  marginBottom: 0,
                }),
              },
            }}
          >
            <ParagraphMedium
              overrides={{
                Block: {
                  style: ({ $theme }) => ({
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: $theme.sizing.scale500,
                  }),
                },
              }}
            >
              Guangzhou
            </ParagraphMedium>
          </Block>
        </Block>
      </Block>
    </article>
  );
}
