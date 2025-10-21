// Random notification messages for testing
export const randomNotifications = [
  {
    message: "API request completed successfully!",
    type: "success"
  },
  {
    message: "Connection timeout - please try again",
    type: "error"
  },
  {
    message: "Code changes saved automatically",
    type: "success"
  },
  {
    message: "Warning: Rate limit approaching (80% used)",
    type: "warning"
  },
  {
    message: "New endpoint added to collection",
    type: "info"
  },
  {
    message: "Authentication token refreshed",
    type: "success"
  },
  {
    message: "Failed to parse OpenAPI specification",
    type: "error"
  },
  {
    message: "Preview updated with latest changes",
    type: "info"
  },
  {
    message: "Slow network detected - optimizing requests",
    type: "warning"
  },
  {
    message: "AI code generation complete!",
    type: "success"
  }
];

// Helper function to get a random notification
export function getRandomNotification() {
  const randomIndex = Math.floor(Math.random() * randomNotifications.length);
  return randomNotifications[randomIndex];
}
