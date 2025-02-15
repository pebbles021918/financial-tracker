import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import "../index.css";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [category, setCategory] = useState(""); // ✅ Added category state

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    setAccounts(storedAccounts);

    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = () => {
    if (!description || !amount || !selectedAccount || (type === "Expense" && !category)) return;

    const newTransaction = {
      description,
      amount: parseFloat(amount),
      type,
      account: selectedAccount,
      category: type === "Expense" ? category : "Income", // ✅ Save category if expense
    };

    setTransactions([...transactions, newTransaction]);
    setDescription("");
    setAmount("");
    setCategory(""); // ✅ Reset category field
  };

  // ✅ Filter transactions by selected account
  const filteredTransactions = transactions.filter(t => t.account === selectedAccount);

  // ✅ Calculate income and expenses for the selected account
  const income = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + t.amount, 0);
  const expenses = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const chartData = [
    ["Category", "Amount"],
    ["Income", income],
    ["Expenses", expenses],
  ];

  return (
    <div className="main-content">
      <h1>Dashboard</h1>

      {/* ✅ Account Selection Dropdown */}
      <div className="expense-form">
        <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
          <option value="">Select Account</option>
          {accounts.map((account, index) => (
            <option key={index} value={account}>{account}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        {/* ✅ Show category dropdown only if Expense is selected */}
        {type === "Expense" && (
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Savings">Savings</option>
          </select>
        )}

        <button onClick={handleAddTransaction}>+ Add</button>
      </div>

      <h2>Income vs. Expenses</h2>
      <div className="chart-container">
        {income === 0 && expenses === 0 ? (
          <p className="no-data-message">No data available</p>
        ) : (
          <Chart chartType="PieChart" width="100%" height="300px" data={chartData} />
        )}
      </div>
    </div>
  );
}
