import React from "react";
import ReactDOM from "react-dom/client";
import CommunityApp from "./Components/Community/CommunityApp";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "./index.css";

// Initialize security monitor early to intercept all requests
import securityMonitor from "./utils/securityMonitor";
// Security monitor is automatically initialized when imported

// Unregister service workers and clear caches to prevent stale asset issues
import "./utils/serviceWorkerCleanup";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <CommunityApp />
  </React.StrictMode>
);



