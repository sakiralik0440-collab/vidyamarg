// Centralized config — easy to switch between dev and production
const isDev = process.env.NODE_ENV !== "production";
const API_URL = process.env.VITE_API_URL ||
  (isDev ? "http://localhost:5000" : "https://vidyamarg-production-50d6.up.railway.app");

export const API_BASE_URL = `${API_URL}/api`;
export const COMPANY_API_URL = `${API_BASE_URL}/company`;