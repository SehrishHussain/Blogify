import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAllPosts, updatePost } from "../store/postSlice";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const post = posts.find((p) => p.id === id);

  // 🟢 Increment view count when post opens
  useEffect(() => {
    if (post) {
      const updated = { ...post, views: (post.views || 0) + 1 };
      dispatch(updatePost(updated));

      // update localStorage too
      const saved = JSON.parse(localStorage.getItem("posts")) || [];
      const newList = saved.map((p) => (p.id === id ? updated : p));
      localStorage.setItem("posts", JSON.stringify(newList));
    }
  }, [post, id, dispatch]);

  if (!post) {
    return (
      <div className="p-8 text-center text-gray-700 dark:text-gray-300">
        Post not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 space-y-6">
      {/* 🏷️ Title */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{post.title}</h1>

      {/* 🧑 Author + Date */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>By {post.authorName || "Unknown"}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* 🖼️ Featured Image (if any) */}
      {post.image && (
        <div className="w-full mt-4">
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded-xl object-cover max-h-[400px] shadow"
          />
        </div>
      )}

      {/* 📝 Post Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      {/* 🏷️ Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 👁️ Views + Back */}
      <div className="flex items-center justify-between mt-8 text-sm text-gray-600 dark:text-gray-400">
        <span>👁️ {post.views || 0} views</span>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default SinglePost;
