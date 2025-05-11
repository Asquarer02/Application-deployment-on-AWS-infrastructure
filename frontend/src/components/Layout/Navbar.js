// src/components/Layout/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#333",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{ color: "#fff", textDecoration: "none", fontSize: "1.5em" }}
      >
        CloudApp
      </Link>
      <ul style={{ listStyle: "none", display: "flex", margin: 0, padding: 0 }}>
        <li style={{ margin: "0 10px" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Home (Posts)
          </Link>
        </li>
        {isAuthenticated ? (
          <>
            <li style={{ margin: "0 10px" }}>
              <Link
                to="/create-post"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Create Post
              </Link>
            </li>
            <li style={{ margin: "0 10px" }}>
              <span>Welcome, {user?.username}</span>
            </li>
            <li style={{ margin: "0 10px" }}>
              <button
                onClick={handleLogoutClick}
                style={{
                  background: "transparent",
                  border: "1px solid white",
                  color: "white",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li style={{ margin: "0 10px" }}>
              <Link
                to="/login"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Login
              </Link>
            </li>
            <li style={{ margin: "0 10px" }}>
              <Link
                to="/register"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
