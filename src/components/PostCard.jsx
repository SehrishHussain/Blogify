import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PostCard({ id, title, slug, featuredImage, views }) {
  const imgUrl = featuredImage;
console.log("trending posts in PostCard");

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Link
        to={`/post/${slug}`}
        className="
          block border rounded-xl shadow-md overflow-hidden 
          bg-white dark:bg-gray-900 
          transition-all duration-300
          hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700
        "
      >
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={imgUrl}
            alt={title}
            className="w-full h-44 object-cover group-hover:opacity-95 group-hover:scale-[1.02] transition-transform duration-300"
          />
          {/* Views badge */}
          <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            👁️ {views || 0}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3
            className="
              text-lg font-semibold mb-2 line-clamp-2 
              group-hover:text-blue-600 dark:group-hover:text-blue-400
              transition-colors
            "
          >
            {title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
