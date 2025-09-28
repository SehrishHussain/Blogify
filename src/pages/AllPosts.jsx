import React, { useEffect } from "react";
import { Container, PostCard } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, selectAllPosts } from "../store/postSlice";

function AllPosts() {
  const dispatch = useDispatch();

  const posts = useSelector(selectAllPosts);   // ✅ selector from adapter
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  return (
    <div className="w-full py-8">
      <Container>
        {/* Loading */}
        {status === "loading" && (
          <p className="text-gray-500">Loading posts...</p>
        )}

        {/* Error */}
        {status === "failed" && (
          <p className="text-red-500 font-medium">{error}</p>
        )}

        {/* Posts */}
        {status === "succeeded" && (
          <div className="flex flex-wrap">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="p-2 w-1/4">
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
