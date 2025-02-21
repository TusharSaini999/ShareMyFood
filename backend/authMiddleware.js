const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized, Invalid token format" });
  }

  const actualToken = tokenParts[1];

  jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired, Please Login!" });
      }
      return res.status(401).json({ message: "Unauthorized", error: err });
    }

    req.user = decoded; // Attach user data to request
    next();
  });
};

module.exports = verifyToken;
