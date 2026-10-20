import axios from 'axios'

// Single source of truth for the backend's base URL.
// Falls back to localhost for local development; set VITE_API_BASE_URL
// in a .env file (or your hosting provider's env settings) for production.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({ baseURL })

export default api
export { baseURL }
