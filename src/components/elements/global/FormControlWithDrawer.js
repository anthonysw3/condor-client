import React, { useState } from "react";

// Base Web
import { FormControl } from "baseui/form-control";

// Components
import UtilityDrawer from "./UtilityDrawer";

export default function FormControlWithDrawer({ key, content, children }) {
  const initialState = { [key]: false };
  const [isOpen, setIsOpen] = useState(initialState);

  const openDrawer = () => {
    setIsOpen((prevOpen) => ({ ...prevOpen, [key]: true }));
  };

  const closeDrawer = () => {
    setIsOpen((prevOpen) => ({ ...prevOpen, [key]: false }));
  };

  return (
    <section>
      <FormControl
        onClick={openDrawer}
        overrides={{
          ControlContainer: {
            style: ({ $theme }) => ({
              marginBottom: $theme.sizing.scale100,
            }),
            props: {
              onClick: () => openDrawer(key),
            },
          },
        }}
      >
        {children}
      </FormControl>
      <UtilityDrawer onClose={closeDrawer} isOpen={isOpen[key]}>
        {content}
      </UtilityDrawer>
    </section>
  );
}
