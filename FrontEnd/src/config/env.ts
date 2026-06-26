export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME ?? "FlowPilot",
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api",
  ENABLE_MOCK_API: (import.meta.env.VITE_ENABLE_MOCK_API ?? "true") === "true",
};
