const mongoose = require("mongoose");
const dotenv = require("dotenv");

const { Schema } = mongoose;
dotenv.config({ path: "./.env" });

mongoose.connect(process.env.DB_URL).then(() => console.log("connected to db"));

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

const transactionSchema = new Schema({
  transactionType: {
    type: String, // "received" or "sent"
    required: true,
  },
  counterpartyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  counterpartyName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const accountSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  transactions: [transactionSchema],
});

const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = { User, Account };
