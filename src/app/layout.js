"use client";

import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider } from "baseui";
import { styled } from "baseui";

// Condor
import CondorLightTheme from "../theme/CondorLightTheme";
import { CondorProvider } from "../components/utils/CondorProvider";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../components/utils/store";

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
          <PersistGate loading={null} persistor={persistor}>
            <StyletronProvider value={engine}>
              <SiteBackground>
                <BaseProvider theme={CondorLightTheme}>
                  <CondorProvider>{children}</CondorProvider>
                </BaseProvider>
              </SiteBackground>
            </StyletronProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
