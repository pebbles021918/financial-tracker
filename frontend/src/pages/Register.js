import React from "react";

function Register() {
  return (
    <div className="register-container">
      <h1>Register</h1>
      <form className="register-form">
        <input className="register-input" type="text" placeholder="Name" />
        <input className="register-input" type="text" placeholder="Email" />
        <input className="register-input" type="password" placeholder="Password" />
        <button className="register-button">Register</button>
      </form>
    </div>
  );
}

export default Register;
