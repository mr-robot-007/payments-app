const express = require("express");
const { User, Account } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const { authMiddleware, LoginAuthMiddleware } = require("../middleware");
const router = express.Router();

// /api/v1/
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const UserSchema = zod.object({
  username: zod.coerce
    .string()
    .email()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30),
  password: zod.coerce
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
  firstname: zod.coerce.string().max(50),
  lastname: zod.coerce.string().max(50),
});

// const requiredUserSchema = User.required();

router.get("/health",(req,res)=>{
  res.status(200).json({
    message: "App is healthy",
  })
});

router.get("/", authMiddleware, async (req, res) => {
  // res.json({ msg: "all ok" });
  const user_info = await User.findOne(
    { _id: req.userId },
    "firstname lastname username"
  );
  res.json({ user_info });
});

router.post("/signup", async (req, res) => {

  const { success } = UserSchema.safeParse(req.body);
  if (!success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser?._id) {
    console.log(existingUser);

    return res.json({
      message: "Email already taken",
    });
  }
  const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);
  const body = {
    username: req.body.username,
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    password:hashedPassword,
  }
  console.log(body);
  const dbUser = await User.create(body);

  /// --- Create new account --- ///
  await Account.create({
    userId: dbUser._id,
    balance: 1 + Math.random() * 10000,
  });

  /// --- ----- --- ///

  const token = jwt.sign({ userId: dbUser._id }, JWT_SECRET);

  res.json({
    message: "User created successfully",
    token,
  });
});

const UserLoginSchema = zod.object({
  username: zod.coerce
    .string()
    .email()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30),
  password: zod.coerce
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});

router.post("/signin", LoginAuthMiddleware, async (req, res) => {
  if (req?.userId) {
    console.log("login success");
    return res.status(200).json({ success: true, message: "login successful" });
  }
  
  const body = req.body;
  if (!body) {
    return res.json({ success: false, message: "Invalid credentials" });
  }
  
  const { username, password } = body;
  console.log("body ", body);
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }
  
  const result = UserLoginSchema.safeParse(body);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message);
    console.log(errorMessages);
    return res.status(400).json({
      success: false,
      message: errorMessages[0],
      errors: errorMessages,
    });
  }

  try {
    // Fetch the user by username
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, foundUser.password);
      if (isPasswordValid) {
        const token = jwt.sign({ userId: foundUser._id }, JWT_SECRET);
        console.log(token);
        return res.status(201).json({
          success: true,
          message: "login successful",
          token,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const updateBody = zod.object({
  password: zod.coerce.string().optional(),
  firstname: zod.coerce.string().optional(),
  lastname: zod.coerce.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const body = req.body;
  // console.log(body);
  const userId = req.userId; // from authMiddleware
  const { success } = updateBody.safeParse(body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const existingUser = await User.findById({ _id: req.userId });

  const updatedUser = await User.updateOne(
    { _id: userId },
    {
      firstname: body.firstname ? body.firstname : existingUser.firstname,
      lastname: body.lastname ? body.lastname : existingUser.lastname,
      password: body.password ? await bcrypt.hash(body.password,saltRounds) : existingUser.password,
    }
  );

  if (updatedUser.acknowledged) {
    return res.json({ message: "Updated successfully." });
  }
  return res.json({ message: "Failed to update." });
});

router.get("/bulk", async (req, res) => {
  console.log("/ bulk requested");
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstname: {
          $regex: filter, // $regex : abc is equal to %abc%
        },
      },
      {
        lastname: {
          $regex: filter,
        },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      _id: user._id,
    })),
  });
});

module.exports = router;
