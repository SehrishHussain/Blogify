import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import {blogService} from "../services"
import { useNavigate , useParams } from 'react-router-dom'


function EditPost() {
  const [post, setPost] = useState(null);  // small typo fix: setPost not setPosts
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      blogService.getPost(slug).then((fetchedPost) => {
        if (fetchedPost) setPost(fetchedPost);
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  const handleUpdate = async (updatedPost) => {
    const res = await blogService.updatePost(post.id, updatedPost);
    if (res) {
      navigate(`/post/${res.slug}`); // go to updated post page
    }
  };

  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} onSubmit={handleUpdate} />
      </Container>
    </div>
  ) : null;
}


export default EditPost
