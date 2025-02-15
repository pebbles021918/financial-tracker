import React, { useState, useEffect } from "react";
import "../index.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filterAccount, setFilterAccount] = useState("");

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);

    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    setAccounts(storedAccounts);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleDeleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
  };

  const handleEditTransaction = (index) => {
    const transaction = transactions[index];
    const updatedDescription = prompt("Edit description:", transaction.description);
    const updatedAmount = prompt("Edit amount:", transaction.amount);
    
    if (updatedDescription !== null && updatedAmount !== null) {
      const updatedTransactions = [...transactions];
      updatedTransactions[index] = {
        ...transaction,
        description: updatedDescription,
        amount: parseFloat(updatedAmount),
      };
      setTransactions(updatedTransactions);
    }
  };

  return (
    <div className="main-content">
      <h1>Transactions</h1>

      {/* Filter Transactions by Account */}
      <div className="filter-section">
        <label>Filter by Account:</label>
        <select value={filterAccount} onChange={(e) => setFilterAccount(e.target.value)}>
          <option value="">All Accounts</option>
          {accounts.map((account, index) => (
            <option key={index} value={account}>{account}</option>
          ))}
        </select>
      </div>

      <ul className="transaction-list">
        {transactions
          .filter((t) => (filterAccount ? t.account === filterAccount : true))
          .map((transaction, index) => (
            <li key={index} className={transaction.type === "Income" ? "income" : "expense"}>
              <span className="transaction-desc">{transaction.description}</span>
              <span className="transaction-amount">${transaction.amount.toFixed(2)}</span>
              <span className="transaction-account">{transaction.account}</span>
              <span className="transaction-type">{transaction.type}</span>
              <button onClick={() => handleEditTransaction(index)}>Edit</button>
              <button onClick={() => handleDeleteTransaction(index)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
