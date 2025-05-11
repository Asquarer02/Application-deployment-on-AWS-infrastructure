// src/components/Posts/PostForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/api"; // We'll use the direct createPost for FormData

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("postImage", image); // 'postImage' must match backend (multer field name)
    }

    try {
      await createPost(formData); // Use the createPost that handles FormData
      setSuccess("Post created successfully!");
      setTitle("");
      setContent("");
      setImage(null);
      // Optionally navigate away or refresh post list
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create New Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image (Optional):</label>
          <input type="file" onChange={handleImageChange} accept="image/*" />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default PostForm;
