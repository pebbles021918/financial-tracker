import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email: form.email }); // ✅ Guarda el login en el contexto
    navigate("/dashboard"); // ✅ Redirige después de iniciar sesión
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="cute-title">✨ Finance Tracker ✨</h1>
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input className="auth-input" type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="auth-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button className="auth-button" type="submit">{isRegister ? "Register" : "Login"}</button>
        </form>
        <p onClick={() => setIsRegister(!isRegister)} className="toggle-auth">
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
