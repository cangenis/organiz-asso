import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getUserRoute } from "../utils/APIRoutes";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/FriendsPage.css";

function FriendsPage() {
  const { userId } = useParams();
  const [friends, setFriends] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${getUserRoute}/${userId}/friends`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriends();
  }, [userId]);

  return (
    <div className="friends-container">
      <h1 style={{ color: "#2a5c88" }}>Number of Friends: {friends.length}</h1>
      <div className="friends-item">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.userId} style={{ marginBottom: "20px" }}>
              <Link to={`/profile/${friend._id}`}>
                <p
                  style={{ fontWeight: "bold" }}
                  className="friend-name"
                >{`${friend.firstName} ${friend.lastName}`}</p>
              </Link>
              <p style={{ fontSize: "smaller" }} className="friend-details">
                {friend.email}
              </p>
              <p style={{ fontSize: "smaller" }} className="friend-details">
                {friend.location}
              </p>
              <p style={{ fontSize: "smaller" }} className="friend-details">
                {friend.occupation}
              </p>
            </div>
          ))
        ) : (
          <p>No friends to display.</p>
        )}
      </div>
    </div>
  );
}

export default FriendsPage;
