"use client";

import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider } from "baseui";
import { styled } from "baseui";

import ResponsiveContainer from "./ResponsiveContainer";

// Condor Theme
import CondorLightTheme from "../theme/CondorLightTheme";

// Redux
import store from "../components/utils/store";
import { Provider } from "react-redux";

const engine = new Styletron();

import "../components/styles/global.css";

const SiteBackground = styled("div", ({ $theme }) => ({
  backgroundColor: $theme.colors.primary50,
  minHeight: "100vh", // full height
  width: "100%", // full width
  margin: 0,
}));

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@100;200;300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <body>
        <Provider store={store}>
          <StyletronProvider value={engine}>
            <BaseProvider theme={CondorLightTheme}>
              <SiteBackground>
                <ResponsiveContainer>{children}</ResponsiveContainer>
              </SiteBackground>
            </BaseProvider>
          </StyletronProvider>
        </Provider>
      </body>
    </html>
  );
}
