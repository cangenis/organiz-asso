import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { registerRoute, loginRoute, getUserRoute } from "../utils/APIRoutes";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && userId) {
        try {
          const response = await axios.get(`${getUserRoute}/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data); // Assuming the endpoint sends back the user data
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          logout(); // Logout the user if token is invalid
        }
      }
    };

    fetchUserData();
  }, [token, userId]);

  // Register handler
  const register = async (userData) => {
    try {
      const response = await axios.post(registerRoute, userData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      setUser(user);
      setToken(token);
      setUserId(user._id);
      console.log("Registration successful with token: ", token);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await axios.post(loginRoute, {
        email,
        password,
      });
      const { token, user } = response.data;
      if (!user.isApproved) {
        throw new Error("User not approved");
      }
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      setUser(user);
      setToken(token);
      setUserId(user._id);
      console.log("Login successful with token: ", token);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.msg === "User not approved"
      ) {
        throw new Error("User not approved");
      } else {
        throw new Error("Login failed:", error);
      }
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
    setUser(null);
    console.log("Logged out successfully");
  };

  // Auth context value
  const value = {
    user,
    userId,
    token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
