import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="vm-page">

      <nav className="vm-navbar">
        <div className="vm-logo">
          <div className="vm-logo-icon">🎓</div>
          VidyaMarg
        </div>

        <div className="vm-nav-actions">
          <button
            className="vm-btn vm-btn-light"
            onClick={() => navigate("/portal")}
          >
            Get Started
          </button>
        </div>
      </nav>

      <section className="vm-hero">
        <div className="vm-container vm-hero-grid">

          <div>
            <div className="vm-badge">
              ✨ One platform. Every opportunity.
            </div>

            <h1>
              Your Journey.
              <br />
              <span className="vm-gradient-text">
                Your Future.
              </span>
            </h1>

            <p className="vm-hero-description">
              VidyaMarg connects students, colleges and companies
              in one intelligent education ecosystem. Discover
              opportunities, track progress and build your future.
            </p>

            <div className="vm-hero-buttons">
              <button
                className="vm-btn vm-btn-primary"
                onClick={() => navigate("/portal")}
              >
                Start Your Journey →
              </button>

              <button
                className="vm-btn vm-btn-light"
                onClick={() => navigate("/portal")}
              >
                Explore Portals
              </button>
            </div>

            <div className="vm-trust">
              <span>✓ Student focused</span>
              <span>✓ College connected</span>
              <span>✓ Career ready</span>
            </div>
          </div>

          <div className="vm-hero-visual">

            <div className="vm-dashboard-card">

              <div className="vm-dashboard-top">
                <div>
                  <strong>Student Progress</strong>
                  <div style={{ color: "#64748b", fontSize: 12 }}>
                    Academic year 2026
                  </div>
                </div>

                <div style={{ fontSize: 28 }}>📈</div>
              </div>

              <div className="vm-mini-chart">
                <div className="vm-bars">
                  <div className="vm-bar" style={{ height: "35%" }} />
                  <div className="vm-bar" style={{ height: "50%" }} />
                  <div className="vm-bar" style={{ height: "45%" }} />
                  <div className="vm-bar" style={{ height: "70%" }} />
                  <div className="vm-bar" style={{ height: "82%" }} />
                  <div className="vm-bar" style={{ height: "94%" }} />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 10,
                  marginTop: 15,
                }}
              >
                <div className="vm-stat">
                  <strong style={{ fontSize: 20 }}>87%</strong>
                  <span>Progress</span>
                </div>

                <div className="vm-stat">
                  <strong style={{ fontSize: 20 }}>12</strong>
                  <span>Skills</span>
                </div>

                <div className="vm-stat">
                  <strong style={{ fontSize: 20 }}>8</strong>
                  <span>Jobs</span>
                </div>
              </div>
            </div>

            <div className="vm-floating-card vm-floating-one">
              🎯 <strong>Career Match</strong>
              <br />
              <small style={{ color: "#64748b" }}>
                94% suitable opportunities
              </small>
            </div>

            <div className="vm-floating-card vm-floating-two">
              🏆 <strong>Achievement</strong>
              <br />
              <small style={{ color: "#64748b" }}>
                New milestone unlocked
              </small>
            </div>

          </div>
        </div>
      </section>

      <section id="portals" className="vm-portals">
        <div className="vm-container">
          <div className="vm-section-title">
            <span>One ecosystem</span>
            <h2>Everything starts here.</h2>
            <p>Choose the portal that matches your journey.</p>
          </div>

          <div className="vm-portal-grid">
            <div
              className="vm-portal-card vm-student-card"
              onClick={() => navigate("/student")}
            >
              <div className="vm-portal-icon">🎓</div>
              <h3>Student</h3>
              <p>Register, track your progress and discover opportunities.</p>
              <div className="vm-portal-arrow">→</div>
            </div>

            <div
              className="vm-portal-card vm-college-card"
              onClick={() => navigate("/college")}
            >
              <div className="vm-portal-icon">🏫</div>
              <h3>College</h3>
              <p>Manage students and improve learning outcomes.</p>
              <div className="vm-portal-arrow">→</div>
            </div>

            <div
              className="vm-portal-card vm-company-card"
              onClick={() => navigate("/company")}
            >
              <div className="vm-portal-icon">🏢</div>
              <h3>Company</h3>
              <p>Discover talent and connect with future professionals.</p>
              <div className="vm-portal-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;