import React, { useState } from "react";

// Base Web
import { ListItem, ListItemLabel } from "baseui/list";
import { Button, SIZE } from "baseui/button";
import { Input } from "baseui/input";
import { Block } from "baseui/block";
import { Drawer } from "baseui/drawer";

// Icons
import { IconFileDatabase, IconPlus } from "@tabler/icons-react";

export default function Status() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Block>
      <ListItem
        endEnhancer={() => (
          <Button
            onClick={() => setIsOpen(true)}
            size={SIZE.mini}
            startEnhancer={<IconPlus size={12} />}
          >
            Status
          </Button>
        )}
      >
        <ListItemLabel>Frequent flyer</ListItemLabel>
      </ListItem>
      <Drawer onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <Input placeholder="Search an airline" />
      </Drawer>
    </Block>
  );
}
