import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  addCommentRoute,
  likePostRoute,
  getUserRoute,
} from "../utils/APIRoutes";
import { useAuth } from "../context/AuthContext";
import "../styles/Post.css";

function Post({ postData, removePost }) {
  const { user, token } = useAuth();
  const [post, setPost] = useState(postData);
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    try {
      const response = await axios.patch(
        `${likePostRoute}/${post._id}/like`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost({ ...post, likes: response.data.likes });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${likePostRoute}/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Post deleted:", response.data);
      removePost(post._id); // Call the function passed as prop to remove post from state
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCommentSubmit = async (commentText) => {
    if (!commentText.trim()) return;
    try {
      const response = await axios.patch(
        `${addCommentRoute}/${post._id}/comment`,
        { userId: user._id, content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost({ ...post, comments: [...post.comments, response.data] });
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleAddRemoveFriend = async () => {
    try {
      const response = await axios.patch(
        `${getUserRoute}/${user._id}/${post.userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { friendsList, isAdded } = response.data;
      if (isAdded) {
        console.log("Friend added");
      } else {
        console.log("Friend removed");
      }
    } catch (error) {
      console.error("Error changing friendship status:", error);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.userId}`} className="post-author">
          {`${post.firstName} ${post.lastName}`}
        </Link>
        <div className="button-container">
          {user._id !== post.userId && (
            <button onClick={handleAddRemoveFriend} className="friend-button">
              Add/Remove Friend
            </button>
          )}
          {user._id === post.userId && (
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
          )}
          <button onClick={handleLike} className="like-button">
            Like ({Object.keys(post.likes || {}).length})
          </button>
        </div>
      </div>
      <p className="post-content">{post.content}</p>
      <small className="post-location">{post.location}</small>
      <small className="post-date">
        {new Date(post.createdAt).toLocaleString()}
      </small>
      {post.comments.map((comment) => (
        <div key={comment._id} className="comment">
          <strong className="comment-author">{`${comment.firstName} ${comment.lastName}`}</strong>
          : {comment.content}
        </div>
      ))}
      <div className="comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          onClick={() => {
            handleCommentSubmit(commentText);
            setCommentText(""); // Reset comment text after submission
          }}
        >
          Comment
        </button>
      </div>
    </div>
  );
}

export default Post;
