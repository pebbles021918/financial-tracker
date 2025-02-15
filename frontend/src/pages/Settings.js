import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; 
import "../index.css";

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // User profile state (empty placeholders)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    navigate("/auth"); // Redirect to login
  };

  return (
    <div className="main-content">
      <h1>Settings</h1>
      <p>Update your profile settings here.</p>

      <div className="settings-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={profile.name}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={profile.email}
          onChange={handleChange}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter new password"
          onChange={handleChange}
        />

        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
