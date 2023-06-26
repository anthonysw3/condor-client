import React from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, SIZE, ANCHOR } from "baseui/drawer";
import { Modal, ROLE } from "baseui/modal";

// Custom Components
import UtilityDrawer from "./drawer";

const ResponsiveDrawerModal = ({
  isOpen,
  onClose,
  title,
  content,
  callbacks,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  const handleSomeEvent = () => {
    if (callbacks.someEvent) {
      callbacks.someEvent();
    }
  };

  if (isMobile) {
    return (
      <UtilityDrawer
        isOpen={isOpen}
        onClose={onClose}
        size={SIZE.full}
        anchor={ANCHOR.right}
        title={title}
        content={content}
      />
    );
  } else {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        role={ROLE.dialog}
        title={title}
        content={content}
      />
    );
  }
};

export default ResponsiveDrawerModal;
