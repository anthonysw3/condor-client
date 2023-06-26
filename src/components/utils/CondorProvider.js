import React, { useState, createContext, useContext } from "react";
import ResponsiveDrawerModal from "../primitives/drawerModal";
import ResponsiveContainer from "./ResponsiveContainer";

const CondorContext = createContext();

export const CondorProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    content: null,
    callbacks: {},
  });

  const openModal = (title, content, callbacks) => {
    setModal({ isOpen: true, title, content, callbacks });
  };

  const closeModal = () => {
    setModal({ isOpen: false, content: null, callbacks: {} });
  };

  return (
    <CondorContext.Provider value={{ openModal, closeModal }}>
      <ResponsiveContainer>
        {children}
        <ResponsiveDrawerModal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          content={modal.content}
          callbacks={modal.callbacks}
        />
      </ResponsiveContainer>
    </CondorContext.Provider>
  );
};

export const useCondor = () => useContext(CondorContext);
