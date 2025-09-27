import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { blogService } from "../services";
import { Container } from "../components";
import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.userData); // user object

  useEffect(() => {
    // Fetch all posts
    blogService.getPosts().then((res) => {
      if (res) setPosts(res.documents);
    });

    // Fetch only this user's posts
    if (authStatus?.$id) {
      blogService.getUserPosts(authStatus.$id).then((res) => {
        if (res) setUserPosts(res.documents);
      });
    }
  }, [authStatus]);

  // 🔥 Sort helpers
  const trendingPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  // Framer Motion Variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const listVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="w-full mt-0">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-pink-200 via-rose-100 to-blue-200 
        dark:from-gray-800 dark:via-gray-900 dark:to-gray-800
        py-16 text-center"
      >
        <Container>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
            Welcome to <span className="text-pink-600">Blogify</span> 🚀
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
            Share your thoughts, discover trending posts, and grow your voice in the
            community.
          </p>
        </Container>
      </motion.section>

      {/* Trending */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-12"
      >
        <Container>
          <h2 className="text-2xl font-semibold mb-6 text-left">🔥 Trending Posts</h2>
          <motion.div
            className="flex flex-wrap"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  className="p-3 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
                >
                  <PostCard {...post} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No trending posts yet.</p>
            )}
          </motion.div>
        </Container>
      </motion.section>

      {/* Latest */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="py-12 bg-gray-50 dark:bg-gray-800/50"
      >
        <Container>
          <h2 className="text-2xl font-semibold mb-6 text-left">🆕 Latest Uploads</h2>
          <motion.div
            className="flex flex-wrap"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  className="p-3 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
                >
                  <PostCard {...post} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No posts available.</p>
            )}
          </motion.div>
        </Container>
      </motion.section>

      {/* My Blogs */}
      {authStatus && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="py-12"
        >
          <Container>
            <h2 className="text-2xl font-semibold mb-6 text-left">✍️ My Blogs</h2>
            <motion.div
              className="flex flex-wrap"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    className="p-3 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
                  >
                    <PostCard {...post} />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">You haven’t written any blogs yet.</p>
              )}
            </motion.div>
          </Container>
        </motion.section>
      )}
    </div>
  );
}

export default Home;
