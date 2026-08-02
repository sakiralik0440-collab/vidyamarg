// Centralized config — easy to switch between dev and production
const isDev = import.meta.env.DEV;

export const API_BASE_URL = isDev
  ? "https://vidyamarg-backend.onrender.com/"
  : (import.meta.env.VITE_API_URL || "https://vidyamarg-backend.onrender.com/");

export const COMPANY_API_URL = `${API_BASE_URL}/company`;