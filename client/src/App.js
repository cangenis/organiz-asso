import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./pages/Navbar";
import FeedPage from "./pages/FeedPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import GoAuthenticatePage from "./pages/GoAuthenticatePage";
import FriendsPage from "./pages/FriendsPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute redirectTo="/feed" component={HomePage} />}
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute redirectTo="/feed" component={LoginPage} />
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute redirectTo="/feed" component={RegisterPage} />
            }
          />
          <Route
            path="/profile/:userId"
            element={<PrivateRoute component={ProfilePage} />}
          />
          <Route path="/feed" element={<PrivateRoute component={FeedPage} />} />
          <Route path="/authentication" element={<GoAuthenticatePage />} />
          <Route
            path="/profile/:userId/friends"
            element={<PrivateRoute component={FriendsPage} />}
          />
          <Route
            path="/admin-panel"
            element={<PrivateRoute component={AdminPanelPage} />}
          />
          <Route
            path="/search"
            element={<PrivateRoute component={SearchResultsPage} />}
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Component to protect routes that require the user to be authenticated
function PrivateRoute({ component: Component }) {
  const { user } = useAuth();
  return user ? <Component /> : <Navigate to="/authentication" />;
}

// Component to redirect authenticated users away from login/register pages
function ProtectedRoute({ component: Component, redirectTo }) {
  const { user } = useAuth();
  return user ? <Navigate to={redirectTo} /> : <Component />;
}
