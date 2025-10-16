import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container, PostCard } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, selectAllPosts } from "../store/postSlice";
import users from "../services/mockData/users.json";

function AllPosts() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  const [selectedTag, setSelectedTag] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  // ✅ Enrich posts with authorName using same logic as Post.jsx
  const enrichedPosts = posts.map((p) => {
    let author =
      users.find((u) => u.id === p.userId) || null;

    if (!author) {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      author = storedUsers.find((u) => u.id === p.userId) || null;
    }

    const authorName = author ? author.name : "Unknown Author";
    return { ...p, authorName };
  });

  const allTags = [...new Set(enrichedPosts.flatMap((p) => p.tags || []))];
  const allAuthors = [...new Set(enrichedPosts.map((p) => p.authorName))];

  const filteredPosts = enrichedPosts.filter((p) => {
    const tagMatch = selectedTag ? p.tags?.includes(selectedTag) : true;
    const authorMatch = selectedAuthor ? p.authorName === selectedAuthor : true;
    return tagMatch && authorMatch;
  });

  return (
    <div className="w-full py-12">
      <Container>
        {/* -------------------- Filter Section -------------------- */}
        {(allTags.length > 0 || allAuthors.length > 0) && (
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
              mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Filter Posts
            </h2>

            {/* Tag and Author Filters */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
              {/* Tag Input */}
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

           {/* -------------------- Author Dropdown -------------------- */}
<div className="relative w-64">
  <button
    onClick={() => setShowSuggestions((prev) => !prev)}
    className="w-full flex justify-between items-center px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700
      bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-800 dark:text-gray-200
      focus:ring-2 focus:ring-pink-500 focus:outline-none
      transition-all duration-200"
  >
    {selectedAuthor || "Select Author"}
    <svg
      className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${showSuggestions ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {showSuggestions && (
    <div
      className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl
        bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <button
        onClick={() => {
          setSelectedAuthor("");
          setShowSuggestions(false);
        }}
        className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-700/30 transition-colors"
      >
        All Authors
      </button>
      {allAuthors.map((author) => (
        <button
          key={author}
          onClick={() => {
            setSelectedAuthor(author);
            setShowSuggestions(false);
          }}
          className={`w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 transition-colors hover:bg-pink-100 dark:hover:bg-pink-700/30 ${
            selectedAuthor === author ? "bg-pink-600 text-white dark:bg-pink-600/80" : ""
          }`}
        >
          {author}
        </button>
      ))}
    </div>
  )}
</div>


              <button
                onClick={() => setShowSuggestions((prev) => !prev)}
                className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-medium transition-all"
              >
                {showSuggestions ? "Hide Suggestions" : "Show Suggestions"}
              </button>

              {(selectedTag || selectedAuthor) && (
                <button
                  onClick={() => {
                    setSelectedTag("");
                    setSelectedAuthor("");
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 underline hover:text-pink-600 ml-2"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Suggested Tags */}
            {showSuggestions && allTags.length > 0 && (
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
          </motion.section>
        )}

        {/* -------------------- Posts Section -------------------- */}
        {status === "loading" && (
          <p className="text-gray-500">Loading posts...</p>
        )}

        {status === "failed" && (
          <p className="text-red-500 font-medium">{error}</p>
        )}

        {status === "succeeded" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No posts found for the selected filter.
              </p>
            )}
          </motion.div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
