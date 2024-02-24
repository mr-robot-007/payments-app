const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const router = express.Router();

mongoose
  .connect("mongodb://localhost:27017/paytmdb")
  .then(() => console.log("connected"));

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({ userId: req.userId });
  if (account) {
    res.json({ balance: account?.balance });
  } else {
    res.json({ message: "No account found for this user" });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const { to, amount } = req.body;
  const toAccount = await Account.findOne({ userId: to });
  const fromAccount = await Account.findOne({ userId: fromAccount });

  const session = await mongoose.startSession();
  session.startTransaction();

  if (!toAccount) {
    res.status(400).json({
      message: "Invalid account",
    });
  }

  if (toAccount === fromAccount) {
    res.json({ message: "Can't send money to the same account." });
  }

  if (fromAccount.balance < amount) {
    res.status(400).json({ message: "Insufficient balance" });
  }

  try {
    await Account.updateOne(
      { userId: fromAccount },
      { $inc: { balance: amount } }
    ).session(session);
    await Account.updateOne(
      { userId: toAccount },
      { $dec: { balance: -1 * amount } }
    ).session(session);

    await session.commitTransaction();
    res.json({ message: "Transaction Successfull" });
  } catch (err) {
    await session.abortTransaction();
    res.json({ message: "Transaction failed" });
    throw err;
  } finally {
    session.endSession();
  }
});

module.exports = router;
