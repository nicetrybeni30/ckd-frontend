import axios from "axios";
import { API_BASE_URL } from "./config";
import { getToken, getRole, clearSession, loginPathFor } from "./auth";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
  withCredentials: true, // allow session + cookies
});

// Automatically attach JWT from localStorage
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout if token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // "/login" does not exist as a route; go to the login page for this role.
      const loginPath = loginPathFor(getRole());
      clearSession();
      window.location.href = loginPath;
    }
    return Promise.reject(error);
  }
);

export default api;
