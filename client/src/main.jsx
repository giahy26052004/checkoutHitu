import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { HashRouter } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <HashRouter basename="/">
        <App />
      </HashRouter>
    </ToastProvider>
  </React.StrictMode>
);
