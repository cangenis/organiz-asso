import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Post from "../components/Post"; // Make sure the path is correct
import { searchPostsRoute } from "../utils/APIRoutes";
import { useAuth } from "../context/AuthContext";
import "../styles/SearchResultsPage.css"; // Assume some basic CSS for styling

const SearchResultsPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query");
  const type = new URLSearchParams(search).get("type") || "content";
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      let endpoint =
        type === "author"
          ? `${searchPostsRoute}/author?query=${query}`
          : `${searchPostsRoute}?query=${query}`;

      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query, type, token]);

  return (
    <div>
      <h1>Posts with: {query}</h1>
      <div className="results-list">
        {posts.map((post) => (
          <Post key={post._id} postData={post} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;
