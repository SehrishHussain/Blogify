// pages/Dashboard.jsx
import React from "react";
import { useSelector } from "react-redux";
import { selectAllPosts } from "../store/postSlice";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const posts = useSelector(selectAllPosts);
  const { userData } = useSelector((state) => state.auth);

  if (!userData) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300">
        Please log in to view your dashboard.
      </div>
    );
  }

  const userId = userData.user.id;
  const userPosts = posts.filter((post) => post.userId === userId);

  // ---- Stats ----
  const totalViews = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalPosts = userPosts.length;
  const latestPostDate =
    userPosts[0]?.createdAt || "N/A"; // already sorted by createdAt desc in slice

  return (
    <div className="p-6 space-y-8">
      {/* ---------- Top Stats Section ---------- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Total Posts
          </h3>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {totalPosts}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Total Views
          </h3>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {totalViews}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Latest Post
          </h3>
          <p className="text-md font-medium text-gray-700 dark:text-gray-300">
            {latestPostDate !== "N/A"
              ? new Date(latestPostDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </section>

      {/* ---------- Posts List Section ---------- */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 p-6 border-b border-gray-200 dark:border-gray-700">
          Your Posts
        </h2>
        {userPosts.length === 0 ? (
          <p className="p-6 text-gray-600 dark:text-gray-400">
            You haven’t written any posts yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Created At
                  </th>
                </tr>
              </thead>

<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  {userPosts.map((post) => (
    <tr
      key={post.id}
      onClick={() => navigate(`/posts/${post.id}`)}
      className="cursor-pointer"
    >
      <td
        className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 
                   transform transition-transform duration-200 
                   hover:scale-105 hover:text-indigo-500"
      >
        {post.title}
      </td>
      <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
        {post.views}
      </td>
      <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
        {new Date(post.createdAt).toLocaleDateString()}
      </td>
    </tr>
  ))}
</tbody>


            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
