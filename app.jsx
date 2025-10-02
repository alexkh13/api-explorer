// Main App Component - requires Babel transpilation
import React from "react";
import ReactDOM from "react-dom";

// Wait for all dependencies to be loaded on window
function waitForDependencies() {
  return new Promise((resolve) => {
    const checkDependencies = () => {
      if (
        window.AppContexts &&
        window.AppComponents &&
        window.Icons &&
        window.AppConstants &&
        window.AppUtils
      ) {
        resolve();
      } else {
        setTimeout(checkDependencies, 10);
      }
    };
    checkDependencies();
  });
}

// Initialize app after dependencies are ready
waitForDependencies().then(() => {
  // Get everything from global scope
  const { ThemeProvider, ChallengeProvider, AIProvider } = window.AppContexts;
  const { ToastProvider, IDEPage } = window.AppComponents;
  const { initialChallengesData } = window.AppConstants;

  // Root App Component wrapping all providers
  function App() {
    return (
      <ThemeProvider>
        <ChallengeProvider initialChallenges={initialChallengesData}>
          <AIProvider>
            <ToastProvider>
              <IDEPage />
            </ToastProvider>
          </AIProvider>
        </ChallengeProvider>
      </ThemeProvider>
    );
  }

  // Render the application
  ReactDOM.render(<App />, document.getElementById("root"));
});
