import React, { useState, useEffect } from "react";
import "../index.css";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    setAccounts(storedAccounts);
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }
  }, [accounts]);

  const handleAddAccount = () => {
    if (!accountName.trim()) return;

    let updatedAccounts;
    if (editingIndex !== null) {
      updatedAccounts = [...accounts];
      updatedAccounts[editingIndex] = accountName;
      setEditingIndex(null);
    } else {
      updatedAccounts = [...accounts, accountName];
    }

    setAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    setAccountName("");
  };

  const handleEditAccount = (index) => {
    setAccountName(accounts[index]);
    setEditingIndex(index);
  };

  const handleDeleteAccount = (index) => {
    const updatedAccounts = accounts.filter((_, i) => i !== index);
    setAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
  };

  return (
    <div className="main-content">
      <h1>Accounts</h1>

      <div className="account-form">
        <input
          type="text"
          placeholder="Account Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
        <button onClick={handleAddAccount}>
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <ul className="account-list">
        {accounts.length === 0 ? <p>No accounts added.</p> : null}
        {accounts.map((account, index) => (
          <li key={index}>
            <span>{account}</span>
            <button onClick={() => handleEditAccount(index)}>Edit</button>
            <button onClick={() => handleDeleteAccount(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
