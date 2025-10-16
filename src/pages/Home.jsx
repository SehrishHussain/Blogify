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
