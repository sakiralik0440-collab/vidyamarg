import { useTheme } from "../../context/ThemeContext";

function ThemeToggle({ className = "", showLabel = false }) {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl border transition-all duration-300 ${
        isDark
          ? "bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700/80 hover:border-slate-600 shadow-md shadow-slate-950/40"
          : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 hover:border-amber-300 shadow-sm"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <span className="text-base transform rotate-0 transition-transform duration-300">
            🌙
          </span>
        ) : (
          <span className="text-base transform rotate-180 transition-transform duration-300">
            ☀️
          </span>
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
