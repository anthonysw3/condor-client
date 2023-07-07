import React, { useState, createContext, useContext } from "react";

// Components
import Layer from "../components/containers/Layer";

const LayerContext = createContext();

export const LayerProvider = ({ children }) => {
  const [layer, setLayer] = useState({
    isOpen: false,
    content: null,
    callbacks: {},
  });

  const openLayer = (title, content, footer, callbacks) => {
    setLayer({ isOpen: true, title, content, footer, callbacks });
  };

  const closeLayer = () => {
    setLayer({ isOpen: false, content: null, callbacks: {} });
  };

  return (
    <LayerContext.Provider value={{ openLayer, closeLayer }}>
      {children}
      <Layer
        isOpen={layer.isOpen}
        onClose={closeLayer}
        title={layer.title}
        content={layer.content}
        footer={layer.footer}
        callbacks={layer.callbacks}
      />
    </LayerContext.Provider>
  );
};

export const useLayer = () => useContext(LayerContext);
