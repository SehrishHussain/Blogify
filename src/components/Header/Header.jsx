import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ThemeToggle from '../ThemeToggle'

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate()

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ]

  return (
    <header className="py-3 shadow transition-colors duration-300 bg-[#f2e2d2] dark:bg-gray-900">
      <Container>
        <nav className="flex items-center">
          {/* Logo */}
          <div className="mr-4">
            <Link to="/">
              <Logo width="70px" />
            </Link>
          </div>

          {/* Nav links */}
          <ul className="flex ml-auto items-center space-x-2">
  {navItems.map((item) =>
    item.active ? (
      <li key={item.name}>
        <button
          onClick={() => navigate(item.slug)}
          className="inline-block px-4 py-2 rounded-full 
             border border-transparent
             transition-colors transition-transform duration-200 
             hover:bg-[#e2cbb8] dark:hover:bg-gray-700 
             text-gray-800 dark:text-gray-200
             transform hover:scale-105 hover:shadow-lg
"
        >
          {item.name}
        </button>
      </li>
    ) : null
  )}

  {/* Logout */}
  {authStatus && (
  <li key="logout">
    <LogoutBtn />
  </li>
)}

  {/* Theme Toggle - ❌ no hover scaling here */}
  <li key="theme-toggle" className="ml-2">
  <ThemeToggle />
</li>
</ul>

        </nav>
      </Container>
    </header>
  )
}

export default Header
