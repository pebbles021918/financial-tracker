import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    login({ email: form.email });
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="cute-title">✨ Finance Tracker ✨</h1>
        <h2>{isRegister ? "Create an Account" : "Welcome Back!"}</h2>

        {error && <p className="error-message">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            autoFocus
          />
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button className="auth-button" type="submit">
            {isRegister ? "Sign Up" : "Login"}
          </button>
        </form>

        <p onClick={() => setIsRegister(!isRegister)} className="toggle-auth">
          {isRegister ? "Already have an account? Login" : "New here? Create an account"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
