import React, { useState, useRef, useEffect } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "../ThemeToggle";
import { Menu, X } from "lucide-react"; // ⬅️ icons for mobile toggle

export default function Header() {
  const { status, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !status },
    { name: "Signup", slug: "/signup", active: !status },
    { name: "All Posts", slug: "/all-posts", active: status },
    { name: "Add Post", slug: "/add-post", active: status },
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
      className="sticky top-4 z-40 mx-auto max-w-6xl 
      rounded-full px-6 py-3
      bg-gradient-to-r from-[#f8e8d9]/90 to-[#e7d3be]/90
      dark:from-gray-800/80 dark:to-gray-700/80
      backdrop-blur-md shadow-lg
      transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]"
    >
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo width="60px" />
          </Link>

         {/* Desktop Nav */}
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

  {/* Profile Dropdown (desktop only) */}
  {status && userData && (
    <li className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
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

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 
          rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn"
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
        </div>
      )}
    </li>
  )}

  {/* Theme Toggle */}
  <li key="theme-toggle">
    <ThemeToggle />
  </li>
</ul>


          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-[#e2cbb8]/60 dark:hover:bg-gray-700 transition"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

{/* Mobile Menu */}
{menuOpen && (
  <div
    className="md:hidden mt-4 mx-auto w-[90%]
    bg-gradient-to-br from-[#f8e8d9]/95 to-[#e7d3be]/90
    dark:from-gray-800/90 dark:to-gray-700/90
    rounded-[2rem] shadow-2xl backdrop-blur-xl
    border border-[#e2cbb8]/40 dark:border-gray-700/60
    animate-fadeIn
    transition-all duration-500 ease-in-out"
  >
    <ul className="flex flex-col items-center space-y-3 py-6 px-4">
      {navItems.map(
        (item) =>
          item.active && (
            <li key={item.name} className="w-full">
              <button
                onClick={() => {
                  navigate(item.slug);
                  setMenuOpen(false);
                }}
                className="w-full py-2.5 text-[16px] font-medium rounded-full
                text-gray-800 dark:text-gray-100
                hover:bg-[#e2cbb8]/70 dark:hover:bg-gray-700/70
                hover:scale-105 transition-all duration-300"
              >
                {item.name}
              </button>
            </li>
          )
      )}

      {/* Profile Options for mobile */}
      {status && userData && (
        <>
          <div className="w-4/5 border-t border-gray-300 dark:border-gray-700 my-2"></div>
          <li className="flex flex-col items-center space-y-2">
            <div
              className="flex items-center justify-center 
              w-12 h-12 rounded-full 
              bg-gradient-to-br from-[#e2cbb8] to-[#d1b7a1]
              dark:from-gray-700 dark:to-gray-600
              text-gray-800 dark:text-gray-200 font-semibold shadow-md"
            >
              {getInitials(userData.user.name)}
            </div>
            {["Profile", "Dashboard", "Settings"].map((page) => (
              <button
                key={page}
                onClick={() => {
                  navigate(`/${page.toLowerCase()}`);
                  setMenuOpen(false);
                }}
                className="w-full py-2 text-[16px] text-gray-800 dark:text-gray-100 
                rounded-full hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition"
              >
                {page}
              </button>
            ))}
            <div className="pt-2 w-full">
              <LogoutBtn />
            </div>
          </li>
        </>
      )}
    </ul>
  </div>
)}


      </Container>
    </header>
  );
}
