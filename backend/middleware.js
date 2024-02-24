const JWT_SECRET = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).json({ message: "Bearer token not found." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({ message: "Invalid token." });
    }
  } catch (err) {
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
