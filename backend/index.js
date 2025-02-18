const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();
const app = express();
const allowedOrigins = ['http://localhost:3000'];

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

const autentication = require('./autentication');
const topl = require('./nogleader');
const don = require('./donation');

app.use('/auto', autentication);
app.use('/top', topl);
app.use('/don', don);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
