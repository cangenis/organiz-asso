import React, { useState, useEffect } from "react";
import axios from "axios";
import { getFeedPostsRoute, createPostRoute } from "../utils/APIRoutes";
import { useAuth } from "../context/AuthContext";
import Post from "../components/Post";
import NewPost from "../components/NewPost";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(getFeedPostsRoute, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [token]); // Fetch posts whenever the token changes

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Add the new post to the top of the list
  };

  const removePostFromState = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  return (
    <div className="feed-container">
      <NewPost onPostSuccess={addNewPost} />
      {posts.map((post) => (
        <Post key={post._id} postData={post} removePost={removePostFromState} />
      ))}
    </div>
  );
};

export default FeedPage;
