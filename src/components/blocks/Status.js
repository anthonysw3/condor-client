import React, { useState } from "react";

// Base Web
import { Block } from "baseui/block";
import { Button, KIND, SIZE, SHAPE } from "baseui/button";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE as MODAL_SIZE,
  ROLE,
} from "baseui/modal";

// Icons
import { IconCurrentLocation, IconPlaneTilt, IconX } from "@tabler/icons-react";

// Condor Components
import { InputText } from "../primitives/input";
import { List } from "../primitives/list";

export default function Status() {
  const [airline, setAirline] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleAirlineChange = (event) => {
    setAirline(event.target.value);
  };

  return (
    <Block>
      <InputText
        label="Airline"
        onChange={handleAirlineChange}
        placeholder="Search for an airline"
      />
      {airline ? (
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale700,
              }),
            },
          }}
        >
          <List
            icon={<IconPlaneTilt size={20} />}
            label="British Airways"
            description="Execuitive Club"
            listEnd={
              <Button
                kind={KIND.secondary}
                size={SIZE.mini}
                shape={SHAPE.pill}
                onClick={() => setIsOpen(true)}
              >
                Add
              </Button>
            }
          />
        </Block>
      ) : (
        <Block
          overrides={{
            Block: {
              style: ({ $theme }) => ({
                marginTop: $theme.sizing.scale700,
              }),
            },
          }}
        >
          <List
            icon={<IconCurrentLocation size={20} />}
            label="Cathay Pacific"
            description="Diamond"
            listEnd={
              <Button
                kind={KIND.secondary}
                size={SIZE.mini}
                shape={SHAPE.circle}
              >
                <IconX size={12} />
              </Button>
            }
          />
        </Block>
      )}
      <Modal
        onClose={() => setIsOpen(false)}
        closeable
        isOpen={isOpen}
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        mountNode={document.getElementById("modalMountRef.current")}
      >
        <ModalBody>
          Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare
          faucibus ex, non facilisis nisl. Maecenas aliquet mauris ut tempus.
        </ModalBody>
      </Modal>
    </Block>
  );
}
