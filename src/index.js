import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import reportWebVitals from "./reportWebVitals";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
// import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

// Initialize security monitor early to intercept all requests
import securityMonitor from "./utils/securityMonitor";
// Security monitor is automatically initialized when imported

// Unregister service workers and clear caches to prevent stale asset issues
import "./utils/serviceWorkerCleanup";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
