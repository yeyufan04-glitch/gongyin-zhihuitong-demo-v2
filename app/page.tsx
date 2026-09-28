"use client";

import { useState } from "react";
import { DemoApp } from "./components/DemoApp";
import { ProductCoverPage } from "./components/ProductCoverPage";

export default function Home() {
  const [entered, setEntered] = useState(false);
  return entered ? <DemoApp /> : <ProductCoverPage onEnter={() => setEntered(true)} />;
}
