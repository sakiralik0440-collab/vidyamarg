import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentByIdAPI } from "../api/studentApi";
import FeaturePage from "./FeaturePage";

import ProgressTracker from "./ProgressTracker";
import ActivityScoreCard from "./ActivityScoreCard";
import AlertCenter from "./AlertCenter";
import CertificateGenerator from "./CertificateGenerator";
import InterviewNotifications from "./InterviewNotifications";
import JobOpportunities from "./JobOpportunities";
import CollegeGuidance from "./CollegeGuidance";
import ScholarshipFinder from "./ScholarshipFinder";
import GovtSchemes from "./GovtSchemes";
import SkillPathFinder from "./SkillPathFinder";
import MentorFinder from "./MentorFinder";
import FeeTracker from "./FeeTracker";
import AchievementWall from "./AchievementWall";
import ExamTracker from "./ExamTracker";
import AnonymousHelpline from "./AnonymousHelpline";

// Central config — one source of truth for icon, title, gradient colors, and component
const FEATURE_CONFIG = {
  alerts: {
    icon: "📱", title: "Family Alerts",
    from: "#dc2626", to: "#ef4444",
    render: (student, id) => <AlertCenter studentId={id} studentName={student.name} />,
  },
  progress: {
    icon: "📊", title: "Academic Progress",
    from: "#ea580c", to: "#f97316",
    render: (student, id) => <ProgressTracker studentId={id} />,
  },
  score: {
    icon: "⚡", title: "Activity Score",
    from: "#9333ea", to: "#a855f7",
    render: (student, id) => <ActivityScoreCard studentId={id} />,
  },
  college: {
    icon: "🎓", title: "College Guidance",
    from: "#2563eb", to: "#3b82f6",
    render: (student) => <CollegeGuidance student={student} />,
  },
  scholarship: {
    icon: "💰", title: "Scholarships",
    from: "#16a34a", to: "#22c55e",
    render: (student) => <ScholarshipFinder student={student} />,
  },
  schemes: {
    icon: "🏛️", title: "Government Schemes",
    from: "#dc2626", to: "#f87171",
    render: (student) => <GovtSchemes student={student} />,
  },
  skills: {
    icon: "🔧", title: "Skill & ITI Courses",
    from: "#4f46e5", to: "#6366f1",
    render: (student) => <SkillPathFinder student={student} />,
  },
  mentor: {
    icon: "🤝", title: "Find a Mentor",
    from: "#0d9488", to: "#14b8a6",
    render: (student) => <MentorFinder student={student} />,
  },
  jobs: {
    icon: "💼", title: "Job Opportunities",
    from: "#2563eb", to: "#60a5fa",
    render: (student) => <JobOpportunities student={student} />,
  },
  interviews: {
    icon: "📞", title: "Interview Requests",
    from: "#0891b2", to: "#22d3ee",
    render: (student, id) => <InterviewNotifications studentId={id} />,
  },
  certificates: {
    icon: "🏅", title: "Certificates",
    from: "#ca8a04", to: "#eab308",
    render: (student, id) => (
      <CertificateGenerator
        studentId={id}
        studentName={student.name}
        studentVillage={student.village}
        studentDistrict={student.district}
      />
    ),
  },
  fees: {
    icon: "💵", title: "Fee & Scholarship Tracker",
    from: "#059669", to: "#10b981",
    render: (student, id) => <FeeTracker studentId={id} />,
  },
  achievements: {
    icon: "🏆", title: "Achievement Wall",
    from: "#d97706", to: "#f59e0b",
    render: (student, id) => (
      <AchievementWall studentId={id} studentName={student.name} />
    ),
  },
  exams: {
    icon: "📅", title: "Exam & Deadline Tracker",
    from: "#7c3aed", to: "#8b5cf6",
    render: (student, id) => <ExamTracker studentId={id} student={student} />,
  },
  helpline: {
    icon: "🔒", title: "Anonymous Helpline",
    from: "#db2777", to: "#ec4899",
    render: (student) => <AnonymousHelpline student={student} />,
  },
};

function FeatureView() {
  const { id, featureId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentByIdAPI(id);
        setStudent(data.student);
      } catch (err) {
        console.error("Failed to load student:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const config = FEATURE_CONFIG[featureId];

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-5xl mb-3">❓</p>
          <p className="text-gray-500 mb-4">Feature not found</p>
          <button
            onClick={() => navigate(`/profile/${id}`)}
            className="text-orange-600 underline text-sm"
          >
            ← Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">Student not found</p>
      </div>
    );
  }

  return (
    <FeaturePage
      icon={config.icon}
      title={config.title}
      gradientFrom={config.from}
      gradientTo={config.to}
      studentId={id}
    >
      {config.render(student, id)}
    </FeaturePage>
  );
}

export default FeatureView;