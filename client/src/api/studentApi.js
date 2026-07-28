import { API_BASE_URL, COMPANY_API_URL } from "../utils/config";

const BASE_URL = API_BASE_URL;
const COMPANY_BASE_URL = COMPANY_API_URL;

// const BASE_URL = "https://vidyamarg-production-50d6.up.railway.app";

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

// Send manual alert
export const sendAlertAPI = async (alertData, token) => {
  const response = await fetch(`${BASE_URL}/alerts/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(alertData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Alert failed");
  return data;
};

// Get alert history
export const getAlertHistoryAPI = async (studentId, token) => {
  const response = await fetch(`${BASE_URL}/alerts/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch alerts");
  return data;
};

// Send custom alert
export const sendCustomAlertAPI = async (alertData, token) => {
  const response = await fetch(`${BASE_URL}/alerts/custom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(alertData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Custom alert failed");
  return data;
};


// Get all colleges
export const getAllCollegesAPI = async () => {
  const response = await fetch(`${BASE_URL}/colleges`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch colleges");
  return data;
};

// Match colleges for a student
export const matchCollegesAPI = async (criteria) => {
  const response = await fetch(`${BASE_URL}/colleges/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(criteria),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Matching failed");
  return data;
};

// Get leaderboard
export const getLeaderboardAPI = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${BASE_URL}/leaderboard?${params}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch leaderboard");
  return data;
};

// Get district comparison
export const getDistrictComparisonAPI = async (state = "Madhya Pradesh") => {
  const response = await fetch(
    `${BASE_URL}/leaderboard/district?state=${state}`
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch districts");
  return data;
};


// Get student certificates
export const getStudentCertificatesAPI = async (studentId) => {
  const response = await fetch(`${BASE_URL}/certificates/${studentId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch certificates");
  return data;
};

// Issue a certificate
export const issueCertificateAPI = async (certData, token) => {
  const response = await fetch(`${BASE_URL}/certificates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(certData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to issue certificate");
  return data;
};

// Auto generate certificates
export const autoGenerateCertificatesAPI = async (academicYear, token) => {
  const response = await fetch(`${BASE_URL}/certificates/auto-generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ academicYear }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Auto-generation failed");
  return data;
};


// Get activity score breakdown
export const getScoreBreakdownAPI = async (studentId) => {
  const response = await fetch(`${BASE_URL}/students/${studentId}/score`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch score");
  return data;
};


// const COMPANY_BASE_URL = "https://vidyamarg-production-50d6.up.railway.app/api/company";

// Register company
export const registerCompanyAPI = async (companyData) => {
  const response = await fetch(`${COMPANY_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(companyData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  return data;
};

// Login company
export const loginCompanyAPI = async (credentials) => {
  const response = await fetch(`${COMPANY_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  return data;
};

// Search students (company)
export const searchStudentsAPI = async (filters, token) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${COMPANY_BASE_URL}/search-students?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Search failed");
  return data;
};

// Post a job
export const postJobAPI = async (jobData, token) => {
  const response = await fetch(`${COMPANY_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Job posting failed");
  return data;
};

// Get all jobs
export const getAllJobsAPI = async () => {
  const response = await fetch(`${COMPANY_BASE_URL}/jobs`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch jobs");
  return data;
};


// Send interview request
export const sendInterviewRequestAPI = async (requestData, token) => {
  const response = await fetch(`${BASE_URL}/interviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

// Get student interviews
export const getStudentInterviewsAPI = async (studentId) => {
  const response = await fetch(`${BASE_URL}/interviews/student/${studentId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Get company interviews
export const getCompanyInterviewsAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/interviews/company`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Update interview status
export const updateInterviewStatusAPI = async (interviewId, status) => {
  const response = await fetch(`${BASE_URL}/interviews/${interviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Update failed");
  return data;
};

// Get interview stats
export const getInterviewStatsAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/interviews/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch stats");
  return data;
};


// Get matching jobs for a student
export const getMatchingJobsAPI = async (studentProfile) => {
  const response = await fetch(`${COMPANY_BASE_URL}/jobs/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentProfile),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch jobs");
  return data;
};


// Match scholarships for student
export const matchScholarshipsAPI = async (studentProfile) => {
  const response = await fetch(`${BASE_URL}/scholarships/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentProfile),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Matching failed");
  return data;
};

// Get all scholarships
export const getAllScholarshipsAPI = async () => {
  const response = await fetch(`${BASE_URL}/scholarships`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};


// Match skill courses
export const matchSkillCoursesAPI = async (profile) => {
  const response = await fetch(`${BASE_URL}/skills/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Search failed");
  return data;
};

// Get all skill courses
export const getAllSkillCoursesAPI = async () => {
  const response = await fetch(`${BASE_URL}/skills`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Match mentors
export const matchMentorsAPI = async (profile) => {
  const response = await fetch(`${BASE_URL}/mentors/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Search failed");
  return data;
};

// Register as mentor
export const registerMentorAPI = async (mentorData) => {
  const response = await fetch(`${BASE_URL}/mentors/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mentorData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  return data;
};


// Get fee tracker
export const getFeeTrackerAPI = async (studentId) => {
  const response = await fetch(`${BASE_URL}/fees/${studentId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Add fee entry
export const addFeeEntryAPI = async (studentId, entry) => {
  const response = await fetch(`${BASE_URL}/fees/${studentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to add entry");
  return data;
};

// Delete fee entry
export const deleteFeeEntryAPI = async (studentId, entryId) => {
  const response = await fetch(`${BASE_URL}/fees/${studentId}/${entryId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete");
  return data;
};


// Get parent dashboard
export const getParentDashboardAPI = async (studentId) => {
  const response = await fetch(
    `${BASE_URL}/students/${studentId}/parent-dashboard`
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};



// Add achievement
export const addAchievementAPI = async (data) => {
  const response = await fetch(`${BASE_URL}/achievements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to add");
  return result;
};

// Get student achievements
export const getStudentAchievementsAPI = async (studentId) => {
  const response = await fetch(
    `${BASE_URL}/achievements/student/${studentId}`
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Get achievement wall
export const getAchievementWallAPI = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${BASE_URL}/achievements/wall?${params}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Like achievement
export const likeAchievementAPI = async (achievementId) => {
  const response = await fetch(
    `${BASE_URL}/achievements/${achievementId}/like`,
    { method: "PUT" }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to like");
  return data;
};

// Delete achievement
export const deleteAchievementAPI = async (achievementId) => {
  const response = await fetch(
    `${BASE_URL}/achievements/${achievementId}`,
    { method: "DELETE" }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete");
  return data;
};

// Get student exams
export const getStudentExamsAPI = async (studentId) => {
  const response = await fetch(`${BASE_URL}/exams/student/${studentId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Get all exams
export const getAllExamsAPI = async () => {
  const response = await fetch(`${BASE_URL}/exams`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Submit helpline request
export const submitHelplineAPI = async (requestData) => {
  const response = await fetch(`${BASE_URL}/helpline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Submission failed");
  return data;
};

// Track helpline request
export const trackHelplineAPI = async (anonymousId) => {
  const response = await fetch(`${BASE_URL}/helpline/${anonymousId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Not found");
  return data;
};

// Get all helpline requests (teacher)
export const getAllHelplineRequestsAPI = async (token, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${BASE_URL}/helpline?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Respond to helpline request (teacher)
export const respondToHelplineAPI = async (requestId, responseData, token) => {
  const response = await fetch(`${BASE_URL}/helpline/${requestId}/respond`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(responseData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to respond");
  return data;
};


// Get district overview
export const getDistrictOverviewAPI = async (token, state = "Madhya Pradesh") => {
  const response = await fetch(
    `${BASE_URL}/district/overview?state=${state}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Get village breakdown
export const getVillageBreakdownAPI = async (district, token) => {
  const response = await fetch(
    `${BASE_URL}/district/${encodeURIComponent(district)}/villages`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Get stream analysis
export const getStreamAnalysisAPI = async (token, district = "") => {
  const params = district ? `?district=${encodeURIComponent(district)}` : "";
  const response = await fetch(
    `${BASE_URL}/district/stream-analysis${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch");
  return data;
};

// Get matching govt schemes
export const matchGovtSchemesAPI = async (profile) => {
  const response = await fetch(`${BASE_URL}/schemes/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed");
  return data;
};

// Get all schemes
export const getAllSchemesAPI = async () => {
  const response = await fetch(`${BASE_URL}/schemes`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed");
  return data;
};