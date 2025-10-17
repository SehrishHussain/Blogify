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

  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState(""); 
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  // Enrich posts with authorName
  const enrichedPosts = posts.map((p) => {
    let author = users.find((u) => u.id === p.userId) || null;
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
      const tagsArray = Array.isArray(p.tags) ? p.tags : []; // ensure it's an array
      const tagMatch =
        selectedTags.length > 0
          ? tagsArray.some((tag) => selectedTags.includes(tag)) // OR logic
          : true;

      const authorMatch = selectedAuthor ? p.authorName === selectedAuthor : true;
      return tagMatch && authorMatch;
    });




  return (
  <div className="w-full py-12">
    <Container>
      {(allTags.length > 0 || allAuthors.length > 0) && (
        <motion.section
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  className="relative z-10 mx-auto max-w-6xl text-center
    rounded-[3rem] overflow-visible
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

  {/* ---------- Tag Input Row ---------- */}
  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
    <div className="flex flex-wrap items-center gap-2 w-64">
      {selectedTags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-pink-600 text-white text-sm"
        >
          #{tag}
          <button
            onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
            className="font-bold"
          >
            ×
          </button>
        </span>
      ))}

      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && tagInput.trim()) {
            if (!selectedTags.includes(tagInput.trim())) {
              setSelectedTags((prev) => [...prev, tagInput.trim()]);
            }
            setTagInput("");
            e.preventDefault();
          }
        }}
        placeholder="Type a tag..."
        className="flex-1 px-2 py-1 rounded-full border border-gray-300 dark:border-gray-700
          focus:ring-2 focus:ring-pink-500 focus:outline-none
          bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200
          placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
      />
    </div>

    <button
      onClick={() => {
        setShowTagSuggestions((prev) => !prev);
        setShowAuthorDropdown(false);
      }}
      className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-medium transition-all"
    >
      {showTagSuggestions ? "Hide Suggestions" : "Show Suggestions"}
    </button>
  </div>

  {/* ---------- Tag Suggestions ---------- */}
  {showTagSuggestions && allTags.length > 0 && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-wrap justify-center gap-2 p-4 rounded-2xl 
        bg-white/60 dark:bg-gray-800/70 backdrop-blur-md shadow-lg 
        border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto mb-6"
    >
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => {
            if (!selectedTags.includes(tag)) {
              setSelectedTags((prev) => [...prev, tag]);
            } else {
              setSelectedTags((prev) => prev.filter((t) => t !== tag));
            }
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedTags.includes(tag)
              ? "bg-pink-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          #{tag}
        </button>
      ))}
    </motion.div>
  )}

  {/* ---------- Author Dropdown ---------- */}
  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6 relative">
    <div className="relative w-64 z-[9999]">
      <button
        onClick={() => {
          setShowAuthorDropdown((prev) => !prev);
          setShowTagSuggestions(false);
        }}
        className="w-full flex justify-between items-center px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-800 dark:text-gray-200
          focus:ring-2 focus:ring-pink-500 focus:outline-none
          transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {selectedAuthor || "Select Author"}
        <svg
          className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${
            showAuthorDropdown ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showAuthorDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute left-0 top-full mt-2 w-full z-[9999]
            rounded-2xl border border-gray-200 dark:border-gray-700
            bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl
            shadow-2xl overflow-hidden max-h-80 overflow-y-auto
            ring-1 ring-black/5 dark:ring-white/10"
        >
          <button
            onClick={() => {
              setSelectedAuthor("");
              setShowAuthorDropdown(false);
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
                setShowAuthorDropdown(false);
              }}
              className={`w-full text-left px-4 py-2 transition-colors 
                hover:bg-pink-100 dark:hover:bg-pink-700/30
                ${
                  selectedAuthor === author
                    ? "bg-pink-600 text-white dark:bg-pink-600/80"
                    : "text-gray-700 dark:text-gray-300"
                }`}
            >
              {author}
            </button>
          ))}
        </motion.div>
      )}
    </div>

    {(selectedTags.length > 0 || selectedAuthor) && (
      <button
        onClick={() => {
          setSelectedTags([]);
          setSelectedAuthor("");
          setTagInput("");
        }}
        className="text-sm text-gray-600 dark:text-gray-400 underline hover:text-pink-600"
      >
        Clear Filters
      </button>
    )}
  </div>
</motion.section>

      )}

      {/* ---------- Posts Section ---------- */}
      {status === "loading" && <p className="text-gray-500">Loading posts...</p>}
      {status === "failed" && <p className="text-red-500 font-medium">{error}</p>}
      {status === "succeeded" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} {...post} />)
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
