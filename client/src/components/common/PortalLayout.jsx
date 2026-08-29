import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

function PortalLayout({ currentPortal = "student", activeSection, onSelectSection, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Top Navigation */}
      <Navbar
        currentPortal={currentPortal}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex">
        {/* Portal-specific Sidebar */}
        <Sidebar
          currentPortal={currentPortal}
          activeSection={activeSection}
          onSelectSection={onSelectSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 lg:pl-72 flex flex-col min-w-0">
          <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PortalLayout;

