import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@kystverket/styrbord/style.css";
import App from "./App.tsx";
import ShipInfo from "./components/shipinfo/ShipInfo";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <ShipInfo />
  </StrictMode>,
);
