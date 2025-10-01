import React, { useEffect, useState, useRef  } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { blogService } from "../services";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Post() {
  const hasIncremented = useRef(false);
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const userData = useSelector((state) => state.auth.userData);
  //console.log("userData in Post", userData);
  //console.log("userData.userData.user.id in POST", userData.user.id);
  //console.log("post in Post", post);
  
  const isAuthor = post && userData ? post.userId === userData.user.id : false;

 useEffect(() => {
    if (!slug || hasIncremented.current) return;

    hasIncremented.current = true; // ✅ prevent double increment
    blogService.getPost(slug).then((fetchedPost) => {
      if (!fetchedPost) {
        navigate("/");
        return;
      }
      setPost(fetchedPost);
    });
  }, [slug, navigate]);


  const deletePost = () => {
    blogService.deletePost(post.id).then((status) => {
      if (status) {
        setShowConfirm(false);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-8">
      <Container>
        {/* Author controls */}
        {isAuthor && (
          <div className="flex justify-end mb-4 space-x-3">
            <Link to={`/edit-post/${post.slug}`}>
      <Button
  className="min-w-[110px] rounded-full px-6 py-2.5 
  bg-gradient-to-br from-[#e2cbb8] to-[#d1b7a1] 
  text-gray-800 shadow-sm border border-[#c9b39a]
  hover:scale-105 hover:shadow-md 
  focus:ring-2 focus:ring-[#d1b7a1] focus:outline-none
  dark:from-gray-700 dark:to-gray-600
  dark:text-gray-200 dark:border-gray-700
  dark:hover:from-gray-600 dark:hover:to-gray-500
  dark:focus:ring-gray-500
  transition-all duration-300"
>
  Edit
</Button>




            </Link>
            <Button
  onClick={() => setShowConfirm(true)}
  className="min-w-[110px] rounded-full px-6 py-2.5 
  bg-rose-700 text-white shadow-sm border border-rose-600
  hover:bg-rose-800 hover:scale-105 
  focus:ring-2 focus:ring-rose-600 focus:outline-none
  dark:bg-rose-800 dark:border-rose-700
  dark:hover:bg-rose-700 
  dark:focus:ring-rose-700 
  transition-all duration-300"
>
  Delete
</Button>

          </div>
        )}

        {/* Blog Image */}
        <div className="w-full flex justify-center mb-4 border rounded-xl p-2">
          <img
            src={post.featuredImage || "/placeholder.jpg"}
            alt={post.title || "placeholder"}
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>

        {/* Blog Title */}
        <div className="w-full mb-2">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>

        {/* Views */}
        <p className="text-sm text-gray-500 mb-6">👁️ {post.views || 0} views</p>

        {/* Blog Content */}
        <div className="browser-css">{parse(post.content)}</div>

        {/* Confirm Dialog */}
        <ConfirmDialog
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={deletePost}
          message="Are you sure you want to delete this blog? This action cannot be undone."
        />
      </Container>
    </div>
  ) : null;
}
