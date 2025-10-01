import React, { useState,  useRef, useEffect  } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "../ThemeToggle";

function Header() {
  const { status, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); // ⬅️ ref for dropdown

   useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !status },
    { name: "Signup", slug: "/signup", active: !status },
    { name: "All Posts", slug: "/all-posts", active: status },
    { name: "Add Post", slug: "/add-post", active: status },
  ];

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <header
      className="sticky top-0 z-40 py-3
      bg-[#f2e2d2]/80 dark:bg-gray-900/80 
      backdrop-blur-md shadow-md
      animate-slideDown"
    >
      <Container>
        <nav className="flex items-center">
          {/* Logo */}
          <div className="mr-4">
            <Link to="/">
              <Logo width="70px" />
            </Link>
          </div>

          {/* Nav links */}
          <ul className="flex ml-auto items-center space-x-3">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="relative inline-block px-4 py-2 rounded-full
                      border border-transparent
                      text-gray-800 dark:text-gray-200
                      transition-all duration-300 ease-out
                      hover:bg-[#e2cbb8]/80 dark:hover:bg-gray-700/80
                      hover:scale-105 hover:shadow-lg"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {/* Profile Dropdown */}
          {status && userData && (
  <li className="relative" ref={dropdownRef}>   {/* ⬅️ added ref here */}
    {/* Circle */}
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

                {/* Dropdown menu */}
{open && (
  <div
    className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 
    rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn"
  >
    <button
      onClick={() => {
        setOpen(false);
        navigate("/profile");
      }}
      className="block w-full text-left px-4 py-2 text-[15px] 
      text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      Profile
    </button>
    <button
      onClick={() => {
        setOpen(false);
        navigate("/dashboard");
      }}
      className="block w-full text-left px-4 py-2 text-[15px] 
      text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      Dashboard
    </button>
    <button
      onClick={() => {
        setOpen(false);
        navigate("/settings");
      }}
      className="block w-full text-left px-4 py-2 text-[15px] 
      text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      Settings
    </button>
    <div className="border-t border-gray-200 dark:border-gray-700"></div>
    <div className="px-1">
      <LogoutBtn />
    </div>
  </div>
)}

              </li>
            )}

            {/* Theme Toggle */}
            <li key="theme-toggle" className="ml-2">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
