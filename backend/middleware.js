const JWT_SECRET = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("bearer token not found");
    return res.status(403).json({ message: "Bearer token not found." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      console.log("decoded");
      next();
    } else {
      console.log("cant decode");
      return res.status(403).json({ message: "Invalid token." });
    }
  } catch (err) {
    console.log("error orccured");
    return res.status(403).json({ message: "Invalid token." });
  }
};

const LoginAuthMiddleware = (req, res, next) => {
  console.log("login auth middleware");
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (authHeader && authHeader?.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.userId) {
        req.userId = decoded.userId;
      }
      console.log("hii");
      throw new Error("cannot verify token");
    } catch (err) {
      console.log(err.message);
    }
  }
  next();
};

module.exports = { authMiddleware, LoginAuthMiddleware };
