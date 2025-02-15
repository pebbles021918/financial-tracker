const express = require("express");
const Transaction = require("../models/Transaction");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
 
