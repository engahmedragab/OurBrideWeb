import React from "react";
import ReactDOM from "react-dom/client";
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

// Subdomain detection
import { isCommunitySubdomain, isGuiderSubdomain } from "./utils/subdomainUtils";

// Lazy load apps based on subdomain
async function loadApp() {
  let App: React.ComponentType;
  
  if (isCommunitySubdomain()) {
    // Load community app for community subdomain
    const CommunityAppModule = await import("./Components/Community/CommunityApp");
    App = CommunityAppModule.default;
  } else if (isGuiderSubdomain()) {
    // Load guider app for guider subdomain
    const GuiderAppModule = await import("./Components/Guider/GuiderApp");
    App = GuiderAppModule.default;
  } else {
    // Load main app for main domain
    const MainAppModule = await import("./App");
    App = MainAppModule.default;
  }

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

loadApp();

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

