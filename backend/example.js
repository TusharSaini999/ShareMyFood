const express = require('express');
const router = express.Router();

// Example GET API
//curl -X GET http://localhost:4000/example -H "x-api-key: hjsBDhjcbdm$%ws42alfndm465a545eafdnsdkjnsd"
router.get('/', (req, res) => {
  res.json({ message: "Welcome to the Example API" });
});


module.exports = router;
