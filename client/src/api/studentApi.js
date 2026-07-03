const BASE_URL = "http://localhost:5000/api";

export const registerStudentAPI = async (studentData) => {
  const response = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const getStudentByIdAPI = async (id, token = null) => {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/students/${id}`, { headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch student");
  }

  return data;
};

// Add a progress record
export const addProgressAPI = async (progressData) => {
  const response = await fetch(`${BASE_URL}/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(progressData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save progress record");
  }

  return data;
};

// Get all progress records for a student
export const getProgressAPI = async (studentId) => {
  const response = await fetch(`${BASE_URL}/progress/${studentId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch progress records");
  }

  return data;
};

// Update a progress record
export const updateProgressAPI = async (progressId, updateData) => {
  const response = await fetch(`${BASE_URL}/progress/${progressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update progress record");
  }

  return data;
};

// Get dropout statistics
export const getDropoutStatsAPI = async () => {
  const response = await fetch(`${BASE_URL}/dropout/stats`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch stats");
  return data;
};

// Get at-risk students
export const getAtRiskStudentsAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/dropout/at-risk`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch at-risk students");
  return data;
};

// Manually run dropout detection
export const runDropoutDetectionAPI = async () => {
  const response = await fetch(`${BASE_URL}/dropout/run`, {
    method: "POST",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Detection failed");
  return data;
};

// Teacher login
export const loginTeacherAPI = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  return data;
};

// Get current teacher
export const getMeAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Auth failed");
  return data;
};

// Get filtered students (with token)
export const getFilteredStudentsAPI = async (filters, token) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${BASE_URL}/students/filter?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch students");
  return data;
};

// Get dropout stats (with token)
export const getStatsAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/dropout/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch stats");
  return data;
};

// Run dropout detection (with token)
export const runDetectionAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/dropout/run`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Detection failed");
  return data;
};