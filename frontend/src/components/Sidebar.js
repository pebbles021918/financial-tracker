import React from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { useAuth } from "../AuthContext"; 

const Sidebar = () => {
  const { logout } = useAuth(); 

  return (
    <div className="sidebar">
      <h1 className="cute-title">Finance Tracker</h1>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/accounts">Accounts</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><button className="logout-button" onClick={logout}>Logout</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
