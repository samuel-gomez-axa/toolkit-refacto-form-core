import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css";
import "./core/grid.css";
import "./core/reboot.css";
import "./core/styles.scss";

import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);
