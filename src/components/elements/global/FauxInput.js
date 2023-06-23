import React from "react";

// Base Web
import { Block } from "baseui/block";

export default function FauxInput(
  label,
  value,
  icon,
  onClick,
  drawerContent,
  ...props
) {
  return <Block>{icon}</Block>;
}
