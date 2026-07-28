const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://vidyamarg-production-50d6.up.railway.app";

export const API_BASE_URL = `${API_URL}/api`;

export const COMPANY_API_URL = `${API_BASE_URL}/company`;