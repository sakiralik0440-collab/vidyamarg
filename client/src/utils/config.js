// Centralized config — easy to switch between dev and production
const isDev = import.meta.env.DEV;

export const API_BASE_URL = isDev
  ? "http://localhost:5000/api"
  : (import.meta.env.VITE_API_URL || "http://localhost:5000/api");

export const COMPANY_API_URL = `${API_BASE_URL}/company`;