// src/components/Posts/PostItem.js
import React from "react";

const PostItem = ({ post, currentUser, onDelete }) => {
  const canDelete = currentUser && currentUser.userId === post.userId;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        margin: "10px 0",
        borderRadius: "5px",
      }}
    >
      <h3>{post.title}</h3>
      <p>
        <small>
          By: {post.authorUsername || "Unknown"} on{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </small>
      </p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          style={{
            maxWidth: "100%",
            maxHeight: "300px",
            display: "block",
            margin: "10px 0",
          }}
        />
      )}
      <p>{post.content}</p>
      {canDelete && (
        <button
          onClick={() => onDelete(post.postId)}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Delete
        </button>
      )}
      {/* Add Edit button/link here if implementing edit functionality */}
    </div>
  );
};

export default PostItem;
