import React from "react";
import { motion } from "framer-motion";

function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  animate = false, // 🔥 allow motion toggle
  ...props
}) {
  const baseStyles = `
    px-4 py-2 rounded-lg font-medium
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    hover:scale-[1.03] active:scale-[0.97]
    shadow-sm hover:shadow-md
  `;

  const Comp = animate ? motion.button : "button";

  return (
    <Comp
      type={type}
      className={`${baseStyles} ${bgColor} ${textColor} ${className}`}
      whileHover={animate ? { y: -2 } : {}}
      whileTap={animate ? { scale: 0.95 } : {}}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Button;
