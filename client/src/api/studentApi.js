import { API_BASE_URL } from "../utils/config";

// ============================================================
// Helper
// ============================================================

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    ""
  );
};

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseResponse = async (response) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

// ============================================================
// STUDENT DASHBOARD
// ============================================================

export const getStudentDashboardAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
};

// ============================================================
// STUDENT PROFILE
// ============================================================

export const getStudentProfileAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/student/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
};

export const updateStudentProfileAPI = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/student/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  return parseResponse(response);
};

// ============================================================
// COLLEGES
// ============================================================

export const getAllCollegesAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/colleges`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
};

export const getCollegeByIdAPI = async (collegeId) => {
  if (!collegeId) {
    throw new Error("College ID is required");
  }

  const response = await fetch(`${API_BASE_URL}/colleges/${collegeId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
};

export const matchCollegesAPI = async (criteria = {}) => {
  const response = await fetch(`${API_BASE_URL}/colleges/match`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(criteria),
  });

  return parseResponse(response);
};

// ============================================================
// SCHOLARSHIPS
// ============================================================

export const getAllScholarshipsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/scholarships`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
};

export const getScholarshipByIdAPI = async (scholarshipId) => {
  if (!scholarshipId) {
    throw new Error("Scholarship ID is required");
  }

  const response = await fetch(
    `${API_BASE_URL}/scholarships/${scholarshipId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return parseResponse(response);
};

export const matchScholarshipsAPI = async (criteria = {}) => {
  const response = await fetch(`${API_BASE_URL}/scholarships/match`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(criteria),
  });

  return parseResponse(response);
};

// ============================================================
// NOTIFICATIONS / ALERTS
// ============================================================

export const getStudentAlertsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/alerts`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response);
};