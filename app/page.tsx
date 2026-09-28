"use client";

import { useState } from "react";
import { DemoApp } from "./components/DemoApp";
import { ProductCoverPage } from "./components/ProductCoverPage";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [initialRole, setInitialRole] = useState<"customer" | "runtime">("customer");
  return entered ? <DemoApp initialRole={initialRole} /> : <ProductCoverPage onEnter={(role = "customer") => { setInitialRole(role); setEntered(true); }} />;
}
