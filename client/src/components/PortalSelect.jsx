import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function PortalSelect() {
  const navigate = useNavigate();
  const { t } = useTranslation();


  const messages = [
    "Welcome to NextStep — please login or register here",
    "Gaon se College Tak — your journey starts here",
    "Track progress, find scholarships, get hired — all in one place",
    "आपकी पढ़ाई, आपका भविष्य — यहां से शुरू करें",
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const options = [
    {
      group: "Student",
      items: [
        {
          label: "Student Registration",
          desc: "New student? Create your profile",
          icon: "📝",
          color: "from-green-600 to-green-700",
          action: () => navigate("/register"),
        },
        {
          label: "Student Login",
          desc: "Already registered? View your profile",
          icon: "👤",
          color: "from-green-400 to-amber-500",
          action: () => navigate("/student/login"),
        },
      ],
    },
    {
      group: "Teacher",
      items: [
        {
          label: "Teacher Login",
          desc: "Access your dashboard",
          icon: "👨‍🏫",
          color: "from-blue-500 to-blue-600",
          action: () => navigate("/teacher/login"),
        },
        {
          label: "Teacher Registration",
          desc: "New teacher? Create an account",
          icon: "🏫",
          color: "from-blue-400 to-sky-500",
          action: () => navigate("/teacher/register"),
        },
      ],
    },
    {
      group: "Company",
      items: [
        {
          label: "Company Login",
          desc: "Find and hire students",
          icon: "🏢",
          color: "from-purple-500 to-purple-600",
          action: () => navigate("/company/login"),
        },
        {
          label: "Company Registration",
          desc: "New company? Register here",
          icon: "🏭",
          color: "from-purple-400 to-fuchsia-500",
          action: () => navigate("/company/register"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-10">
      <div className="max-w-md mx-auto">

        <div className="text-5xl mb-3">🎓</div>
        <h1 className="text-2xl font-bold text-gray-800">NextStep</h1>
        <div className="h-10 flex items-center justify-center mt-2 px-4">
          <p
            key={messageIndex}
            className="text-sm text-gray-500 animate-fadeIn text-center"
          >
            {messages[messageIndex]}
          </p>
        </div>

        {/* Option Groups */}
        <div className="space-y-6">
          {options.map((group) => (
            <div key={group.group}>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">
                {group.group}
              </p>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full bg-gradient-to-r ${item.color} rounded-2xl p-4 text-left shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {item.label}
                        </p>
                        <p className="text-white/80 text-xs mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-8">
          🔒 Your data is safe and secure
        </p>
      </div>
    </div>
  );
}

export default PortalSelect;