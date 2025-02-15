import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import "../index.css";

export default function Reports() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
  }, []);

  // Group expenses by category
  const expenseCategories = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  // Convert data into chart format
  const chartData = [
    ["Category", "Amount"],
    ...Object.entries(expenseCategories),
  ];

  const chartOptions = {
    title: "Expense Breakdown",
    pieHole: 0.4,
    backgroundColor: "transparent",
    chartArea: { width: "90%", height: "80%" },
    legendTextStyle: { fontSize: 14 },
  };

  return (
    <div className="main-content">
      <h1>Expense Breakdown</h1>
      <div className="chart-container">
        {chartData.length > 1 ? (
          <Chart
            chartType="PieChart"
            width="100%"
            height="300px"
            data={chartData}
            options={chartOptions}
          />
        ) : (
          <p>No expense data available</p>
        )}
      </div>
    </div>
  );
}
