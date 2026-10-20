// Single source of truth for the backend's base URL.
// Locally this falls back to http://localhost:8000.
// For deployment, set VITE_API_BASE_URL (see .env.example).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
