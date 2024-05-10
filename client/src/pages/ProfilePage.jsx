import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Post from "../components/Post";
import NewPost from "../components/NewPost";
import { getUsersPostsRoute, getUserRoute } from "../utils/APIRoutes";
import "../styles/ProfilePage.css";

function Profile() {
  const { userId: profileUserId } = useParams();
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState({});
  const { user, token } = useAuth();

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Add the new post to the top of the list
  };

  const removePostFromState = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${getUserRoute}/${profileUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchUsersPosts = async () => {
    try {
      const response = await axios.get(
        `${getUsersPostsRoute}/${profileUserId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUsersPosts();
  }, [profileUserId, token]); // Depend on profileUserId and token to re-fetch if they change

  return (
    <>
      <div className="profile-section">
        <h1 style={{ color: "#25547e" }}>Organiz'Asso Profile</h1>
        <p>
          <strong>Name:</strong> {profileUser.firstName}
        </p>
        <p>
          <strong>Surname:</strong> {profileUser.lastName}
        </p>
        <p>
          <strong>Email:</strong> {profileUser.email}
        </p>
        <p>
          <strong>Location:</strong> {profileUser.location}
        </p>
        <p>
          <strong>Occupation:</strong> {profileUser.occupation}
        </p>
        <Link
          to={`/profile/${profileUserId}/friends`}
          className="friends-button"
        >
          Friends
        </Link>
        {user && user.isAdmin && (
          <Link to="/admin-panel" className="admin-panel-button">
            Admin Dashboard
          </Link>
        )}
      </div>
      {user._id === profileUserId && <NewPost onPostSuccess={addNewPost} />}
      <h1 style={{ color: "#25547e" }}>Posts</h1>
      {posts.map((post) => (
        <Post key={post._id} postData={post} removePost={removePostFromState} />
      ))}
    </>
  );
}

export default Profile;
