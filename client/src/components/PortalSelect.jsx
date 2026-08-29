import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const portalData = [
  {
    id: "student",
    title: "Student Portal",
    icon: "🎓",
    route: "/student",
    loginRoute: "/student/login",
    registerRoute: "/student/register",
    className: "vm-student-card",
    features: ["CGPA", "Jobs", "Skills", "Certificates"],
    intro: "Track learning, discover opportunities, and build your future.",
  },
  {
    id: "college",
    title: "College Portal",
    icon: "🏫",
    route: "/college",
    loginRoute: "/college/login",
    registerRoute: "/college/register",
    className: "vm-college-card",
    features: ["Students", "Attendance", "Reports", "Alerts"],
    intro: "Manage students, monitor progress, and improve outcomes.",
  },
  {
    id: "company",
    title: "Company Portal",
    icon: "🏢",
    route: "/company",
    loginRoute: "/company/login",
    registerRoute: "/company/register",
    className: "vm-company-card",
    features: ["Hiring", "Talent", "Jobs", "Interviews"],
    intro: "Find talent, post jobs, and connect with future professionals.",
  },
  {
    id: "parent",
    title: "Parent Portal",
    icon: "👨‍👩‍👧",
    route: "/parent",
    loginRoute: "/parent/login",
    registerRoute: "/parent/register",
    className: "vm-parent-card",
    features: ["Progress", "Alerts", "Fees", "Support"],
    intro: "Stay informed about your child’s growth and academic progress.",
  },
];

function PortalSelect() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem("vm_auth"));
  });

  const handleAuthAction = (mode) => {
    localStorage.setItem("vm_auth", mode);
    setIsAuthenticated(true);
  };

  const cards = useMemo(() => portalData, []);

  if (!isAuthenticated) {
    return (
      <div className="vm-page vm-auth-gate">
        <div className="vm-auth-card">
          <div className="vm-badge">🔐 Access required</div>
          <h2>Welcome to VidyaMarg</h2>
          <p>
            Please register or login first to continue to the portal dashboard.
          </p>

          <div className="vm-auth-actions">
            <button className="vm-btn vm-btn-primary" onClick={() => handleAuthAction("login")}>
              Login
            </button>
            <button className="vm-btn vm-btn-light" onClick={() => handleAuthAction("register")}>
              Register
            </button>
          </div>

          <div className="vm-auth-note">After login, you can open any portal below.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="vm-page">
      <nav className="vm-navbar">
        <div className="vm-logo">
          <div className="vm-logo-icon">🎓</div>
          VidyaMarg
        </div>

        <button className="vm-btn vm-btn-light" onClick={() => navigate("/")}>
          ← Home
        </button>
      </nav>

      <section className="vm-portal-page">
        <div className="vm-container">
          <div className="vm-section-title">
            <div className="vm-badge">🚀 Let's get started</div>
            <h2>
              Choose your
              <br />
              <span className="vm-gradient-text">journey</span>
            </h2>
            <p>Select your portal and enter the VidyaMarg ecosystem.</p>
          </div>

          <div className="vm-portal-grid">
            {cards.map((portal) => (
              <div key={portal.id} className={`vm-portal-card ${portal.className}`}>
                <div className="vm-portal-icon">{portal.icon}</div>
                <h3>{portal.title}</h3>
                <p>{portal.intro}</p>

                <div className="vm-feature-list">
                  {portal.features.map((feature) => (
                    <button key={feature} className="vm-feature-btn" type="button">
                      {feature}
                    </button>
                  ))}
                </div>

                <div className="vm-card-actions">
                  <button className="vm-btn vm-btn-light vm-card-btn" onClick={() => navigate(portal.loginRoute)}>
                    Login
                  </button>
                  <button className="vm-btn vm-btn-primary vm-card-btn" onClick={() => navigate(portal.registerRoute)}>
                    Register
                  </button>
                  <button className="vm-btn vm-btn-light vm-card-btn vm-open-btn" onClick={() => navigate(portal.route)}>
                    Open Portal
                  </button>
                </div>

                <div className="vm-portal-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PortalSelect;

