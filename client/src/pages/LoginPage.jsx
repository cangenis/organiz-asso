import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import nameLogo from "../assets/organizasso-name-transparent.png";
import { ToastContainer, toast } from "react-toastify";
import "../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [message, setMessage] = useState("");

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  // Checking if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/feed"); // Navigate to the feed page if already logged in
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  };

  const validateForm = () => {
    const { email, password } = credentials;
    if (email === "" || password === "") {
      //toast.error("Email and password are required.", toastOptions);
      setMessage("Email and password are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await login(credentials.email, credentials.password);
        //navigate("/feed"); // Redirect user after successful login
      } catch (error) {
        /*toast.error(
          "Login failed. Please check your credentials.",
          toastOptions
        );*/
        if (error.message === "User not approved") {
          setMessage("User not approved. Please wait for approval.");
        } else {
          setMessage(
            "Login failed. Please check your credentials or wait for approval."
          );
        }
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={nameLogo}
          alt="Name Logo"
          style={{
            maxWidth: "250px",
          }}
        />
      </div>
      <br />
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="login-link">
          Login
        </button>
        <p>{message}</p>
        <span>
          Don't have an account? <Link to="/register">Join us!</Link>
        </span>
      </form>
    </div>
  );
}

export default LoginPage;
