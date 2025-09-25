import React from 'react'

function Logo({ width = '100px' }) {
  return (
    <div style={{ width }}>
      {/* Light mode logo */}
      <img
        src="/logo-light.png"   // put in /public/logo-light.png
        alt="App Logo Light"
        className="block dark:hidden h-20 w-auto"
      />

      {/* Dark mode logo */}
      <img
        src="/dark-mode-logo.png"    // put in /public/logo-dark.png
        alt="App Logo Dark"
        className="hidden dark:block h-20 w-auto"
      />
    </div>
  )
}

export default Logo
