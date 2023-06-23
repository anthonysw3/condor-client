import React, { useState, Children } from "react";
import { Block } from "baseui/block";
import { LabelMedium } from "baseui/typography";

export const Tab = ({ label, icon, children }) => {
  return { label, icon, children };
};

export const Tabs = ({ children }) => {
  const tabs = Children.map(children, (child) => {
    return child.props;
  });

  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <Block>
      <Block display="flex">
        {tabs.map((tab, index) => (
          <Block
            key={tab.label}
            overrides={{
              Block: {
                style: ({ $theme }) => ({
                  padding: `${$theme.sizing.scale400} ${$theme.sizing.scale800}`,
                  backgroundColor:
                    tab.label === activeTab
                      ? `${$theme.colors.backgroundPrimary}`
                      : `${$theme.colors.backgroundTertiary}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center", // Adjusted alignment
                  justifyContent: "space-between",
                  borderTopLeftRadius:
                    index === 0 ? $theme.borders.radius500 : "0",
                  borderTopRightRadius:
                    index === tabs.length - 1 ? $theme.borders.radius500 : "0",
                }),
              },
            }}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.icon && (
              <Block
                overrides={{
                  Block: {
                    style: ({ $theme }) => ({
                      marginRight: $theme.sizing.scale300,
                      marginTop: $theme.sizing.scale100,
                    }),
                  },
                }}
              >
                {tab.icon}
              </Block>
            )}
            <LabelMedium>{tab.label}</LabelMedium>
          </Block>
        ))}
      </Block>
      <Block
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              padding: `${$theme.sizing.scale700}`,
              backgroundColor: `${$theme.colors.backgroundPrimary}`,
              overflow: "hidden",
              borderTopRightRadius: $theme.borders.radius500,
              borderBottomRightRadius: $theme.borders.radius500,
              borderBottomLeftRadius: $theme.borders.radius500,
              boxShadow: "0 6px 12px -6px rgba(0, 0, 0, 0.1)", // Custom shadow style
            }),
          },
        }}
      >
        {tabs.map((tab) => {
          if (tab.label !== activeTab) return undefined;
          return tab.children;
        })}
      </Block>
    </Block>
  );
};
