import React from "react";

function Login() {
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form">
        <input className="login-input" type="text" placeholder="Email" />
        <input className="login-input" type="password" placeholder="Password" />
        <button className="login-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
