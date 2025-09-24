import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { blogService} from "../services";
import { Container } from "../components";
import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";


function Home() {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.userData); // user object

console.log("posts:", posts);


 useEffect(() => {
  // Fetch all posts
  blogService.getPosts().then((res) => {
    console.log("📌 getPosts raw response:", res); 
    if (res) setPosts(res.documents);
  });

//  console.log("Auth Statuss:", authStatus);

  // Fetch only this user's posts
  if (authStatus?.$id) {
    blogService.getUserPosts(authStatus.$id).then((res) => {
      console.log("user's posts", res)
      if (res) setUserPosts(res.documents);
      
    });
  }
}, [authStatus]);


  // 🔥 Sort helpers
  const trendingPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0)) // assumes "views" field exists
    .slice(0, 4);

  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  // Animation config
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full py-8 mt-4 text-center">
      {/* Header */}
      <Container>
        <div className="flex flex-wrap">
          <div className="p-2 w-full">
            <h1 className="text-2xl font-bold">Welcome to Blogify!!</h1>
          </div>
        </div>
      </Container>

      {/* Trending Posts */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <Container>
          <h2 className="text-xl font-semibold mb-4 text-left">Trending Posts</h2>
          <div className="flex flex-wrap">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post) => (
                <div key={post.id} className="p-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                  <PostCard {...post} />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No trending posts yet.</p>
            )}
          </div>
        </Container>
      </motion.div>

      {/* Latest Uploads */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <Container>
          <h2 className="text-xl font-semibold mb-4 text-left">Latest Uploads</h2>
          <div className="flex flex-wrap">
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
                >
                  <PostCard {...post} />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No posts available.</p>
            )}
          </div>
        </Container>
      </motion.div>

      {/* My Blogs */}
      {authStatus && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <Container>
            <h2 className="text-xl font-semibold mb-4 text-left">My Blogs</h2>
            <div className="flex flex-wrap">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
                  >
                    <PostCard {...post} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  You haven’t written any blogs yet.
                </p>
              )}
            </div>
          </Container>
        </motion.div>
      )}
    </div>
  );
}

export default Home;
