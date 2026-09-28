import React from "react";
import { createRoot } from "react-dom/client";
import "../../app/globals.css";
import { DemoApp } from "../../app/components/DemoApp";
import { ProductCoverPage } from "../../app/components/ProductCoverPage";
import { useState } from "react";

function StaticRoot() {
  const [entered, setEntered] = useState(false);
  return entered ? <DemoApp /> : <ProductCoverPage onEnter={() => setEntered(true)} />;
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><StaticRoot /></React.StrictMode>);
