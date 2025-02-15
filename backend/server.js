const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  balance: { type: Number, default: 0 },
});

const Account = mongoose.model("Account", AccountSchema);

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  description: String,
  amount: Number,
  type: String,
  category: String,
  date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "2h" });
  res.json({ token, user: { email: user.email, userId: user._id } });
});

app.post("/accounts", authenticateToken, async (req, res) => {
  const { name, balance } = req.body;
  const newAccount = new Account({
    userId: new mongoose.Types.ObjectId(req.user.userId),
    name,
    balance,
  });

  try {
    const savedAccount = await newAccount.save();
    res.json(savedAccount);
  } catch (error) {
    res.status(500).json({ message: "Error creating account" });
  }
});

app.get("/accounts", authenticateToken, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.userId });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching accounts" });
  }
});

app.put("/accounts/:id", authenticateToken, async (req, res) => {
  const { name, balance } = req.body;
  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      { name, balance },
      { new: true }
    );
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: "Error updating account" });
  }
});

app.delete("/accounts/:id", authenticateToken, async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account" });
  }
});

app.post("/transactions", authenticateToken, async (req, res) => {
  const { accountId, description, amount, type, category } = req.body;
  const newTransaction = new Transaction({
    userId: new mongoose.Types.ObjectId(req.user.userId),
    accountId: new mongoose.Types.ObjectId(accountId),
    description,
    amount,
    type,
    category,
  });

  try {
    const savedTransaction = await newTransaction.save();
    res.json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error saving transaction" });
  }
});

app.get("/transactions", authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

app.put("/transactions/:id", authenticateToken, async (req, res) => {
  const { description, amount, type, category } = req.body;
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { description, amount, type, category },
      { new: true }
    );
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction" });
  }
});

app.delete("/transactions/:id", authenticateToken, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
