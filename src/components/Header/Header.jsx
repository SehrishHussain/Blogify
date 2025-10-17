import React, { useState, useRef, useEffect } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "../ThemeToggle";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { status, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "All Posts", slug: "/all-posts", active: true },
    { name: "Add Post", slug: "/add-post", active: status },
    { name: "Dashboard", slug: "/dashboard", active: status },
  ];

  const getInitials = (name) =>
    !name
      ? "?"
      : name
          .split(" ")
          .map((part) => part[0].toUpperCase())
          .join("")
          .slice(0, 2);

  return (
    <header
      className="sticky top-4 z-50 mx-auto max-w-6xl rounded-full px-6 py-3
      bg-gradient-to-r from-[#f8e8d9]/90 to-[#e7d3be]/90
      dark:from-gray-800/80 dark:to-gray-700/80
      backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-500"
    >
      <Container>
        <nav className="flex items-center justify-between">
          {/* Left Section — Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo width="55px" />
          </Link>

          {/* Center Nav for Desktop */}
          <ul className="hidden md:flex items-center space-x-3">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-4 py-2 rounded-full
                      text-gray-800 dark:text-gray-200
                      transition-all duration-300
                      hover:bg-[#e2cbb8]/80 dark:hover:bg-gray-700/80
                      hover:scale-105 hover:shadow-md"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {/* 🔹 If logged in: show profile dropdown */}
            {status && userData ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                  }}
                  className="flex items-center justify-center 
                  w-10 h-10 rounded-full 
                  bg-gradient-to-br from-[#e2cbb8] to-[#d1b7a1]
                  dark:from-gray-700 dark:to-gray-600
                  text-gray-800 dark:text-gray-200 
                  font-semibold shadow-md 
                  hover:scale-105 hover:shadow-lg 
                  transition-all duration-300"
                >
                  {getInitials(userData.user.name)}
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      key="dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 
                      rounded-lg shadow-lg overflow-hidden z-[9999]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {["Profile", "Dashboard", "Settings"].map((page) => (
                        <button
                          key={page}
                          onClick={() => {
                            setOpen(false);
                            navigate(`/${page.toLowerCase()}`);
                          }}
                          className="block w-full text-left px-4 py-2 text-[15px] 
                          text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {page}
                        </button>
                      ))}

                      <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      <div className="px-1">
                        <LogoutBtn />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* 🔹 If logged out: show Login + Sign Up */
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-full text-gray-800 dark:text-gray-100 
                  hover:bg-[#e2cbb8]/70 dark:hover:bg-gray-700/70
                  transition-all duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 rounded-full bg-[#d1b7a1] text-gray-800 dark:bg-gray-700 dark:text-gray-100
                  hover:bg-[#c7ab96] dark:hover:bg-gray-600 transition-all duration-300 shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Theme Toggle */}
            <li key="theme-toggle">
              <ThemeToggle />
            </li>
          </ul>

          {/* Right Section — Profile (Mobile) + Menu Icon */}
<div className="flex items-center gap-3 md:hidden">
  {/* 🔹 Mobile Profile Button */}
  {status && userData && (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="flex items-center justify-center 
        w-10 h-10 rounded-full 
        bg-gradient-to-br from-[#e2cbb8] to-[#d1b7a1]
        dark:from-gray-700 dark:to-gray-600
        text-gray-800 dark:text-gray-200 
        font-semibold shadow-md 
        hover:scale-105 hover:shadow-lg 
        transition-all duration-300"
      >
        {getInitials(userData.user.name)}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 
            rounded-lg shadow-lg overflow-hidden z-[9999]"
            onClick={(e) => e.stopPropagation()}
          >
            {["Profile", "Dashboard", "Settings"].map((page) => (
              <button
                key={page}
                onClick={() => {
                  setOpen(false);
                  navigate(`/${page.toLowerCase()}`);
                }}
                className="block w-full text-left px-4 py-2 text-[15px] 
                text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {page}
              </button>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            <div className="px-1">
              <LogoutBtn />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )}

  {/* 🔹 Mobile Menu Icon */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="p-2 rounded-md hover:bg-[#e2cbb8]/60 dark:hover:bg-gray-700 transition"
  >
    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
  </button>
</div>

        </nav>

        {/* 🔹 Mobile Dropdown Menu (with Login/Signup fallback) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            menuOpen
              ? "max-h-[600px] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-3"
          }`}
        >
          <div
            className="mt-4 mx-auto w-[90%]
            bg-gradient-to-br from-[#f8e8d9]/95 to-[#e7d3be]/90
            dark:from-gray-800/90 dark:to-gray-700/90
            rounded-[2rem] shadow-2xl backdrop-blur-xl
            border border-[#e2cbb8]/40 dark:border-gray-700/60
            p-6"
          >
            <ul className="flex flex-col items-center space-y-3">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name} className="w-full">
                      <button
                        onClick={() => {
                          navigate(item.slug);
                          setMenuOpen(false);
                        }}
                        className="w-full py-2 text-[16px] font-medium rounded-full
                        text-gray-800 dark:text-gray-100
                        hover:bg-[#e2cbb8]/70 dark:hover:bg-gray-700/70
                        hover:scale-105 transition-all duration-300"
                      >
                        {item.name}
                      </button>
                    </li>
                  )
              )}

              {/* 🔹 If not logged in — show Login/SignUp */}
              {!status && (
                <div className="flex flex-col gap-3 w-full pt-3 border-t border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-full text-gray-800 dark:text-gray-100 
                    hover:bg-[#e2cbb8]/70 dark:hover:bg-gray-700/70 transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-full bg-[#d1b7a1] text-gray-800 dark:bg-gray-700 dark:text-gray-100
                    hover:bg-[#c7ab96] dark:hover:bg-gray-600 transition-all duration-300 shadow-md"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Theme Toggle */}
              <div className="pt-3 border-t border-gray-300 dark:border-gray-700 w-4/5 flex justify-center">
                <ThemeToggle />
              </div>
            </ul>
          </div>
        </div>
      </Container>
    </header>
  );
}
