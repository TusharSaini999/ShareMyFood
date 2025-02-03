const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const allowedOrigins = ['http://localhost:3000'];
const API_KEY = process.env.API_KEY; // Secure key from .env

// Middleware to check host
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use(bodyParser.json());

// Middleware to check API Key
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }
  next();
});

// Import route files
const exampleRoute = require("./example");

// Use routes
app.use("/example", exampleRoute);
app.use("/images", express.static(path.join(__dirname, "./images")));
app.use("/profile", express.static(path.join(__dirname, "./profile")));


// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
