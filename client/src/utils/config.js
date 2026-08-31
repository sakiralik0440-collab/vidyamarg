const defaultApiUrl =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? ""
    : "https://vidyamarg-backend.onrender.com";

const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

export const API_BASE_URL = API_URL ? `${API_URL}/api` : "/api";
export const COMPANY_API_URL = `${API_BASE_URL}/company`;