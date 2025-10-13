// Main App Component - requires Babel transpilation
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, EndpointProvider, AIProvider } from "./contexts.js";
import { ToastProvider, IDEPage } from "./components.js";
import { initialEndpointsData } from "./constants.js";

console.log('[app.js] Starting app with ES6 modules...');

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

// Render the application
console.log('[app.js] Rendering app...');
ReactDOM.render(<App />, document.getElementById("root"));
