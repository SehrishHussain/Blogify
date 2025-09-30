import React, { useState, useEffect } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { authService } from "./services";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const dispatch = useDispatch();

  // Handle auth (hydrate Redux state)
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((data) => {
        if (data) {
          dispatch(login(data)); // ✅ send data directly
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Apply theme to <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7ff] dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 text-black dark:text-gray-200 rounded-2xl shadow-md transition-colors duration-300">
        <Header theme={theme} setTheme={setTheme} />
        <main className="my-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
