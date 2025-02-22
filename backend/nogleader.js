const express = require('express');
const router = express.Router();
const db = require("./db");
require('dotenv').config();

//Top NGO pages
//http://localhost:4000/top
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      @rownum := @rownum + 1 AS 'rank',
      ngo.image AS 'profile_photo',
      ngo.name,
      ngo.address,
      ngo.phone,
      ngo.email,
      ngo.totaldonecout AS 'total_donations',
      ROUND(4.5 + (ngo.totaldonecout * 0.5) / max_donations.max_donations, 1) AS 'rating'
    FROM ngo
    JOIN (SELECT MAX(totaldonecout) AS max_donations FROM ngo) AS max_donations
    CROSS JOIN (SELECT @rownum := 0) AS init
    ORDER BY ngo.totaldonecout DESC
    LIMIT 10;
  `;

  db.query(sql, (err, results) => {
      if (err) {
          console.error('Database query failed:', err); 
          return res.status(500).json({ error: 'Database query failed' });
      }

      return res.status(200).json(results);
  });
});

module.exports = router;