import React, { useState } from "react";
import axios from "axios";
import { createPostRoute } from "../utils/APIRoutes";
import { useAuth } from "../context/AuthContext";
import "../styles/NewPost.css";

function NewPost({ onPostSuccess }) {
  const [postContent, setPostContent] = useState("");
  const { user, token } = useAuth();

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    if (!postContent.trim()) return; // Prevent empty posts
    try {
      const postData = {
        userId: user._id,
        content: postContent,
      };
      const response = await axios.post(createPostRoute, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onPostSuccess(response.data); // Invoke the callback with the new post
      setPostContent(""); // Clear the input after successful post creation
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="post-container">
      <form className="post-form" onSubmit={handlePostSubmit}>
        <textarea
          className="input-field"
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea>
        <button type="submit" className="post-button">
          Post
        </button>
      </form>
    </div>
  );
}

export default NewPost;
