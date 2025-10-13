// Main App Component - ES6 module
import React from "react";
import ReactDOM from "react-dom";

// ES6 imports from modularized directories
import { ThemeProvider, EndpointProvider, AIProvider } from "./contexts/index.jsx";
import { IDEPage, ToastProvider } from "./components/index.jsx";

// Import from window (plain JS, not transpiled)
const { initialEndpointsData } = window.AppConstants;

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
ReactDOM.render(<App />, document.getElementById("root"));
