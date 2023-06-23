"use client";

import React from "react";

// Base Web
import { Grid, Cell } from "baseui/layout-grid";

// Containers
import SearchTabs from "../components/containers/SearchTabs";

export default function Home() {
  return (
    <main>
      <SearchTabs />
    </main>
  );
}
