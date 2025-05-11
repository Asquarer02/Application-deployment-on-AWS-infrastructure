// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import PostList from "./components/Posts/PostList";
import PostForm from "./components/Posts/PostForm";
// import PostDetail from './components/Posts/PostDetail'; // Optional

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="App">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <div className="container" style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginForm onLogin={handleLogin} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/" />}
          />
          <Route
            path="/create-post"
            element={isAuthenticated ? <PostForm /> : <Navigate to="/login" />}
          />
          {/* Add routes for editing posts if needed */}
          {/* <Route path="/post/:id" element={<PostDetail />} /> */}
          {/* <Route path="/edit-post/:id" element={isAuthenticated ? <EditPostForm /> : <Navigate to="/login" />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
