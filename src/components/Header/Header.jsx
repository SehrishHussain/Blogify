// Header.jsx
import React from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "../ThemeToggle";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

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
                      {/* underline effect */}
                      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                    </button>
                  </li>
                )
            )}

            {/* Logout */}
            {authStatus && (
              <li key="logout">
                <LogoutBtn />
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
