import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "../components";
import PostCard from "../components/PostCard";
import { useSelector, useDispatch } from "react-redux";
import AnimatedLatestPosts from "../components/AnimatedLatestPosts";
import {
  fetchPosts,
  selectAllPosts,
} from "../store/postSlice";

/* -------------------- Variants -------------------- */
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
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* -------------------- Skeleton -------------------- */
const SkeletonCard = () => (
  <div className="animate-pulse p-3 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

/* -------------------- PostGrid -------------------- */
function PostGrid({ title, posts, loading, skeletonCount = 4, emptyMessage }) {
  console.log("trending posts in POSTGRID", posts);
  
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
      className="py-12"
    >
      <Container>
        <h2 className="text-2xl font-semibold mb-6 text-left">{title}</h2>
        <motion.div
          className="flex flex-wrap"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {loading ? (
            Array.from({ length: skeletonCount }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                className="p-3 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
              >
                
                
                <PostCard {...post} />
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">{emptyMessage}</p>
          )}
        </motion.div>
      </Container>
    </motion.section>
  );
}

/* -------------------- Home -------------------- */
function Home() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector((state) => state.posts.status);
  const authUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (postStatus === "idle") dispatch(fetchPosts());
  }, [postStatus, dispatch]);

  const [selectedTag, setSelectedTag] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))];
  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags?.includes(selectedTag))
    : [];
 const loading = postStatus === "loading" || postStatus === "idle";

  const trendingPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);
  const userPosts = authUser
    ? posts.filter((p) => p.userId === authUser?.user?.id)
    : [];

 
  console.log("trending", trendingPosts);
  

  return (
    <div className="w-full mt-0">
     
  {/* -------------------- HERO / WELCOME SECTION -------------------- */}
<motion.div
  initial={{ opacity: 0, y: -40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="mx-auto max-w-6xl text-center px-10 py-14
    bg-gradient-to-br from-[#fffaf7]/95 via-[#fbefe3]/95 to-[#f4dfc8]/95
    dark:from-gray-800/80 dark:via-gray-750/80 dark:to-gray-700/80
    backdrop-blur-xl shadow-2xl
    rounded-[3rem]
    transition-all duration-700 hover:shadow-3xl hover:scale-[1.01]
    mb-16"  // ⬅️ Added spacing below
>
  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
    Welcome to <span className="text-pink-600">Blogify</span> 
  </h1>
  <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
    Share your thoughts, discover trending posts, and grow your voice in
    the community.
  </p>
</motion.div>


{/* -------------------- FILTER SECTION -------------------- */}
{allTags.length > 0 && (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="relative overflow-hidden mx-auto max-w-6xl text-center
      rounded-[3rem]
      bg-gradient-to-br from-[#fffaf7]/95 via-[#fbefe3]/95 to-[#f4dfc8]/95
      dark:from-gray-800/80 dark:via-gray-750/80 dark:to-gray-700/80
      backdrop-blur-xl shadow-2xl
      py-14 px-8 transition-all duration-700
      hover:shadow-3xl hover:scale-[1.01]"
  >
    <Container>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Filter by Topic
      </h2>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
        <input
          type="text"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          placeholder="Type a tag..."
          className="px-4 py-2 w-64 rounded-full border border-gray-300 dark:border-gray-700
            focus:ring-2 focus:ring-pink-500 focus:outline-none
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-800 dark:text-gray-200
            placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
        />
        <button
          onClick={() => setShowSuggestions((prev) => !prev)}
          className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-medium transition-all"
        >
          {showSuggestions ? "Hide Suggestions" : "Show Suggestions"}
        </button>
        {selectedTag && (
          <button
            onClick={() => setSelectedTag("")}
            className="text-sm text-gray-600 dark:text-gray-400 underline hover:text-pink-600 ml-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Suggested Tags */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 p-4 rounded-2xl 
            bg-white/60 dark:bg-gray-800/70 backdrop-blur-md shadow-lg 
            border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto mb-6"
        >
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedTag === tag
                  ? "bg-pink-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              #{tag}
            </button>
          ))}
        </motion.div>
      )}

      {/* Filtered Posts */}
      {selectedTag && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-4"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Showing posts tagged with <span className="text-pink-600">#{selectedTag}</span>
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  className="w-full"
                >
                  <PostCard {...post} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No posts found for this tag.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </Container>
  </motion.section>
)}


    {/* -------------------- TRENDING -------------------- */}
<motion.section
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="relative overflow-hidden mx-auto max-w-6xl text-center
    rounded-[3rem]
    bg-gradient-to-br from-[#fffaf7]/95 via-[#fbefe3]/95 to-[#f4dfc8]/95
    dark:from-gray-800/80 dark:via-gray-750/80 dark:to-gray-700/80
    backdrop-blur-xl shadow-2xl
    py-14 px-8 transition-all duration-700
    hover:shadow-3xl hover:scale-[1.01]
    mt-16 mb-12"
>
  <PostGrid
    title="Trending Posts"
    posts={trendingPosts}
    loading={loading}
    skeletonCount={8}
    emptyMessage="No trending posts yet."
  />
</motion.section>


      {/* -------------------- LATEST -------------------- */}
      {latestPosts.length > 0 && (
        <AnimatedLatestPosts posts={latestPosts.slice(0, 9)} />
      )}

      {/* -------------------- USER POSTS -------------------- */}
      {authUser && (
        <PostGrid
          title="My Blogs"
          posts={userPosts}
          loading={loading}
          skeletonCount={2}
          emptyMessage="You haven’t written any blogs yet."
        />
      )}
    </div>
  );
}

export default Home;
