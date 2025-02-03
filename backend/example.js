const express = require('express');
const router = express.Router();

// Example GET API
router.get('/', (req, res) => {
  res.json({ message: "Welcome to the Example API" });
});


module.exports = router;
