import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import nameLogo from "../assets/organizasso-name-transparent.png";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "../styles/RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };
  const { register, login, user } = useAuth();
  const [message, setMessage] = useState("");
  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    occupation: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleValidation = () => {
    const { firstName, lastName, email, location, occupation, password } =
      credentials;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setMessage("Enter all required fields");
      return false;
    } else if (password !== confirmPassword) {
      setMessage("Password and confirm password should be the same");
      return false;
    } else if (password.length < 8) {
      setMessage("Password should be equal or greater than 8 characters");
      return false;
    } else if (email === "") {
      setMessage("Email is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      try {
        await register(credentials);
        navigate("/login"); // Navigate to the home page after successful registration
      } catch (error) {
        console.error("Registration failed:", error);
        if (error.message === "Email already exists") {
          setMessage("Email already exists");
        } else {
          setMessage("Registration failed. Please try again.");
        }
      }
    }
  };

  return (
    <div className="register-container">
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
      <form
        action=""
        onSubmit={(event) => handleSubmit(event)}
        className="register-form"
      >
        <div>
          <label>
            First Name:
            <input
              type="text"
              placeholder="required"
              name="firstName"
              onChange={(event) => handleChange(event)}
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              type="text"
              placeholder="required"
              name="lastName"
              onChange={(event) => handleChange(event)}
            />
          </label>
        </div>
        <div>
          <label>
            Location:
            <input
              type="text"
              placeholder="recommended"
              name="location"
              onChange={(event) => handleChange(event)}
            />
          </label>
        </div>
        <div>
          <label>
            Occupation
            <input
              type="text"
              placeholder="recommended"
              name="occupation"
              onChange={(event) => handleChange(event)}
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              placeholder="required"
              name="email"
              onChange={(event) => handleChange(event)}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              placeholder="required"
              name="password"
              onChange={(event) => handleChange(event)}
            />
          </label>
        </div>
        <div>
          <label>
            Confirm Password:
            <input
              type="password"
              placeholder="required"
              name="confirmPassword"
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>
        </div>
        <button type="submit" className="register-link">
          Register
        </button>
        <p>{message}</p>
        <span>
          Already have an account? <Link to="/login">Login!</Link>
        </span>
      </form>
    </div>
  );
}

export default RegisterPage;
