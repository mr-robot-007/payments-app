const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const router = express.Router();

mongoose
  .connect(
    "mongodb+srv://anujgusain108:mrrobot007@cluster0.2h2iuwo.mongodb.net/paytmdb"
  )
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
  // console.log(toAccount, fromAccount);
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

  try {
    await Account.updateOne(
      { userId: fromAccount.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: toAccount.userId },
      { $inc: { balance: amount } }
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

module.exports = router;
