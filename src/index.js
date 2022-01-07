import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css";
import "./grid.css";
import "./reboot.css";
import "./styles.scss";

import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
