import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import horizontalLogo from "../assets/organizasso-horizontal-transparent.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("content"); // Default search type is "content"
  const { user, logout } = useAuth();

  const handleLogout = (event) => {
    event.preventDefault();
    logout(); // Call logout from AuthContext
    navigate("/");
  };

  const handleSearch = (event) => {
    if (event.key === "Enter" && searchQuery) {
      navigate(
        `/search?type=${searchType}&query=${encodeURIComponent(searchQuery)}`
      );
    }
  };

  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-logo">
        <img src={horizontalLogo} alt="Horizontal Logo" />
      </Link>
      <div className="navbar-links">
        {user && (
          <>
            <select
              className="search-type-selector"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="content">Content</option>
              <option value="author">Author</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              className="navbar-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
          </>
        )}
        {user ? (
          <>
            <Link to={`/profile/${user._id}`} style={{ marginRight: "10px" }}>
              Go to Profile
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "10px" }}>
              Login
            </Link>
            <Link to="/register" style={{ marginRight: "10px" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
