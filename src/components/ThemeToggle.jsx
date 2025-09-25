import { useEffect, useState } from "react";

function ThemeToggle() {
  // initialize with system preference OR saved preference
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="inline-block px-4 py-2 rounded-full duration-200 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border dark:border-gray-600"
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;
