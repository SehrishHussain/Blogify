import React from 'react'

function Button( {
    children,  // could be button text and written button text in return as well
    type = 'button',
    bgColor ='bg-blue-600',
    textColor = 'text-white',
    className = '',
    ...props
}) {
  return (
    <button className={`px-4 py-2 rounded-lg 
    ${bgColor} ${textColor}
    ${className}`}{...props}>
      {children}  
    </button>
  )
}

export default Button
