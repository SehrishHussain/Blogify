// components/AnimatedLatestPosts.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PostCard from "./PostCard";

const AnimatedLatestPosts = ({ posts }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Cycle highlight every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [posts.length]);

  // Split posts into 3 columns for layout
  const columns = [[], [], []];
  posts.forEach((post, i) => columns[i % 3].push({ ...post, globalIndex: i }));

  return (
    <section className="relative overflow-hidden mx-auto max-w-7xl
  rounded-[3rem] md:rounded-[5rem]
  bg-gradient-to-r from-[#f8e8d9]/90 to-[#e7d3be]/90
  dark:from-gray-800/80 dark:to-gray-700/80
  backdrop-blur-lg shadow-2xl
  py-20 px-6 transition-all duration-500
  hover:shadow-[0_0_40px_rgba(0,0,0,0.2)] hover:scale-[1.01]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Latest Stories</h2>
        <p className="text-gray-400">Fresh insights and thoughts from our creators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
        {columns.map((col, colIndex) => (
          <div key={colIndex}>
            {col.map((post) => (
              <motion.div
                key={post.id}
                animate={{
                  scale: activeIndex === post.globalIndex ? 1.08 : 1,
                  opacity: activeIndex === post.globalIndex ? 1 : 0.9,
                  zIndex: activeIndex === post.globalIndex ? 10 : 1,
                }}
                transition={{ duration: 0.6 }}
                className="mb-6 transform-gpu"
              >
                <PostCard {...post} />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnimatedLatestPosts;
