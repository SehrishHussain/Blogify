import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import { blogService } from "../services";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const [error, setError] = useState(null); // ✅ error state

  useEffect(() => {
    setLoading(true);
    setError(null);

    blogService
      .getPosts()
      .then((res) => {
        if (res) {
          setPosts(res.documents);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        setError("Something went wrong while loading posts.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        {/* Loading */}
        {loading && <p className="text-gray-500">Loading posts...</p>}

        {/* Error */}
        {error && (
          <p className="text-red-500 font-medium">
            {error}
          </p>
        )}

        {/* Posts */}
        {!loading && !error && (
          <div className="flex flex-wrap">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.$id} className="p-2 w-1/4">
                  <PostCard {...post} />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No posts found.</p>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
