import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap's CSS is loaded

import "./index.css"; // Your custom CSS last

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
