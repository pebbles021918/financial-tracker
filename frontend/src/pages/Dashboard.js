import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import "../index.css";
import { useAuth } from "../AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchAccounts = async () => {
      try {
        const res = await fetch("http://localhost:5000/accounts", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setAccounts(data);
          if (!selectedAccount) {
            setSelectedAccount(data[0]._id);
          }
        } else {
          setAccounts([]);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [user]);

  const handleAddTransaction = async () => {
    if (!description || !amount || !selectedAccount || (type === "Expense" && !category)) {
      alert("Please fill out all required fields.");
      return;
    }

    const newTransaction = {
      accountId: selectedAccount,
      description,
      amount: parseFloat(amount),
      type,
      category: type === "Expense" ? category : "Income",
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newTransaction),
      });

      if (res.ok) {
        const savedTransaction = await res.json();
        setTransactions([...transactions, savedTransaction]);
        setDescription("");
        setAmount("");
        setCategory("");
      } else {
        console.error("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <div className="main-content">
      <h1>Dashboard</h1>

      <div className="expense-form">
        <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
          <option value="">Select Account</option>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.name}
              </option>
            ))
          ) : (
            <option disabled>No accounts found</option>
          )}
        </select>

        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

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
      <Chart chartType="PieChart" width="100%" height="300px" data={[["Category", "Amount"], ["Income", 0], ["Expenses", 0]]} />
    </div>
  );
}
