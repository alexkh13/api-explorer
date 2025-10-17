// Main App Component - ES6 module
import React from "react";
import { createRoot } from "react-dom/client";

// ES6 imports from modularized directories
import { ThemeProvider, EndpointProvider, AIProvider } from "./contexts/index.jsx";
import { IDEPage, ToastProvider } from "./components/index.jsx";
import { initialEndpointsData } from "./data/initial-endpoints.js";

// Root App Component wrapping all providers
function App() {
  return (
    <ThemeProvider>
      <EndpointProvider initialEndpoints={initialEndpointsData}>
        <AIProvider>
          <ToastProvider>
            <IDEPage />
          </ToastProvider>
        </AIProvider>
      </EndpointProvider>
    </ThemeProvider>
  );
}

// Render the application using React 19 createRoot API
const root = createRoot(document.getElementById("root"));
root.render(<App />);
