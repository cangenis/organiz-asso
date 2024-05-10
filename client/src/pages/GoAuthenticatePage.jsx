import React from "react";
import { Link } from "react-router-dom";
import "../styles/GoAuthenticatePage.css";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoAuthenticatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Checking if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/feed"); // Navigate to the feed page if already logged in
    }
  }, [user, navigate]);
  return (
    <div style={{ padding: "20px" }}>
      <h1 className="auth-header">You are not authenticated.</h1>
      <p className="auth-text">
        Please <Link to="/login">log in</Link> to view this page
      </p>
    </div>
  );
}

export default GoAuthenticatePage;
