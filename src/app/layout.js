"use client";

import { Client as Styletron } from "styletron-engine-atomic";
import { Server as StyletronServer } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider } from "baseui";
import { styled, useStyletron } from "baseui";

// Condor
import CondorLightTheme from "../theme/CondorLightTheme";
import { LayerProvider } from "../contexts/LayerProvider";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../components/utils/store/store";

// Grid
import { Container } from "react-grid-system";

const engine =
  typeof window !== "undefined" ? new Styletron() : new StyletronServer();

import "../components/styles/global.css";

const AppContainer = styled("div", ({ $theme }) => ({
  backgroundColor: $theme.colors.primary50,
  minHeight: "100vh", // full height
  width: "100%", // full width
  margin: 0,
}));

export default function RootLayout({ children }) {
  const [css, theme] = useStyletron();
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@100;200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StyletronProvider value={engine}>
              <BaseProvider theme={CondorLightTheme}>
                <LayerProvider>
                  <AppContainer>
                    <Container
                      style={{ paddingTop: `${theme.sizing.scale600}` }}
                    >
                      {children}
                    </Container>
                  </AppContainer>
                </LayerProvider>
              </BaseProvider>
            </StyletronProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
