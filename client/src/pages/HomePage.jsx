import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
  return (
    <div className="home-container">
      <h1 className="home-header">Welcome to Organiz'Asso</h1>
      <p className="home-text">
        This is the new way to exchange ideas and participate in discussions.
      </p>
      <Link to="/login" className="join-button">
        Join Us Now!
      </Link>
    </div>
  );
}

export default HomePage;
