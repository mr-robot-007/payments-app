const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account, User } = require("../db");
const dotenv = require("dotenv");
const { getCurrentDateTime } = require("../helpers/getCurrentDateTime");
const router = express.Router();

dotenv.config({ path: './.env' });

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("connected to account "));

router.get("/balance", authMiddleware, async (req, res) => {
  console.log("balance requested", req.userId);
  const account = await Account.findOne({ userId: req.userId });
  if (account) {
    res.json({ balance: account?.balance });
  } else {
    res.json({ message: "No account found for this user" });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const { to, amount } = req.body;
  // console.log(req.userId);
  const toAccount = await Account.findOne({ userId: to });
  const fromAccount = await Account.findOne({ userId: req.userId });
  const toUser = await User.findById({ _id: to });
  const fromUser = await User.findById({ _id: req.userId });
  // console.log(toUser, fromUser);
  // console.log(amount);
  const session = await mongoose.startSession();
  session.startTransaction();

  if (!toAccount) {
    res.status(400).json({
      message: "Invalid account",
    });
  }
  if (to === req.userId) {
    console.log("hooo");
    return res.json({
      status: "Failed",
      message: "Can't send money to the same account.",
    });
    // throw new Error("Can't send money to the same account.");
  }

  if (fromAccount.balance < amount) {
    return res
      .status(400)
      .json({ status: "Failed", message: "Insufficient balance" });
    // throw new Error("Insufficient balance");
  }
  const { formattedDate, formattedTime } = getCurrentDateTime();
  console.log(formattedDate, formattedTime);

  try {
    const sendersObject = {
      transactionType: "sent",
      counterpartyId: toAccount.userId,
      counterpartyName: toUser.firstname + " " + toUser.lastname,
      amount: amount,
      date: formattedDate,
      time: formattedTime,
    };
    const recieversObject = {
      transactionType: "recieved",
      counterpartyId: fromAccount.userId,
      counterpartyName: fromUser.firstname + " " + fromUser.lastname,
      amount: amount,
      date: formattedDate,
      time: formattedTime,
    };
    // console.log(sendersObject);
    // console.log(recieversObject);

    await Account.updateOne(
      { userId: fromAccount.userId },
      { $inc: { balance: -amount }, $push: { transactions: sendersObject } }
    ).session(session);

    await Account.updateOne(
      { userId: toAccount.userId },
      { $inc: { balance: amount }, $push: { transactions: recieversObject } }
    ).session(session);

    await session.commitTransaction();
    res
      .status(200)
      .json({ status: "success", message: "Transaction Successful" });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.json({ status: "Failed", message: "Transaction failed" });
    // throw err;
  } finally {
    session.endSession();
  }
});

router.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const data = await Account.findOne({ userId: req.userId });
    res.json({ transactions: data.transactions });
  } catch (err) {
    console.log(err.message);
    res.json({ message: "failed to fetch transactions" });
  }
});

module.exports = router;
