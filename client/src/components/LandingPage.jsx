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
              VidyaMarg brings together four key portals for students,
              colleges, companies and parents — all in one connected ecosystem.
              Explore the platform, sign in, and move into your role-based dashboard.
            </p>

            <div className="vm-hero-buttons">
              <button
                className="vm-btn vm-btn-primary"
                onClick={() => navigate("/portal")}
              >
                Start Your Journey →
              </button>
            </div>

            <div className="vm-trust vm-trust-row">
              <span>✓ Student portal</span>
              <span>✓ College portal</span>
              <span>✓ Company portal</span>
              <span>✓ Parent portal</span>
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
          </div>

          <div className="vm-brief-info">
            <div className="vm-brief-card vm-student-card">
              <div className="vm-brief-icon">🎓</div>
              <div>
                <h3>Student Portal</h3>
                <p>Track performance, skills, and career growth through one connected dashboard.</p>
              </div>
            </div>

            <div className="vm-brief-card vm-college-card">
              <div className="vm-brief-icon">🏫</div>
              <div>
                <h3>College Portal</h3>
                <p>Monitor attendance, outcomes, and academic engagement with actionable insights.</p>
              </div>
            </div>

            <div className="vm-brief-card vm-company-card">
              <div className="vm-brief-icon">🏢</div>
              <div>
                <h3>Company Portal</h3>
                <p>Discover talent, post jobs, and connect with future-ready candidates faster.</p>
              </div>
            </div>

            <div className="vm-brief-card vm-parent-card">
              <div className="vm-brief-icon">👨‍👩‍👧</div>
              <div>
                <h3>Parent Portal</h3>
                <p>Stay informed about progress, support, fees, and important updates in real time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;