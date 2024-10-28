import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./css//Boosters.css";
import "./css/Card.css";
import "./css/CardPopup.css";
import "./css/Collections.css";
import "./css/fonts.css";
import "./css/Header.css";
import "./css/Menu.css";

const node = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(node);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
