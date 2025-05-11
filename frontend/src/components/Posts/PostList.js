// src/components/Posts/PostList.js
import React, { useState, useEffect } from "react";
import { fetchPosts, deletePost as apiDeletePost } from "../../services/api";
import PostItem from "./PostItem";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const getPosts = async () => {
      try {
        setLoading(true);
        const response = await fetchPosts();
        setPosts(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await apiDeletePost(postId);
      setPosts(posts.filter((post) => post.postId !== postId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete post.");
      console.error("Delete error:", err.response || err);
    }
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to create one!</p>
      ) : (
        posts.map((post) => (
          <PostItem
            key={post.postId}
            post={post}
            currentUser={currentUser}
            onDelete={handleDeletePost}
          />
        ))
      )}
    </div>
  );
};

export default PostList;
