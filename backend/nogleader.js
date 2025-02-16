// Importing required modules
const express = require('express');
const router = express.Router();
const db = require("./db");
require('dotenv').config();

//Top NGO pages
//http://localhost:4000/top
router.get('/', (req, res) => {
    const sql = `
      SELECT 
        ROW_NUMBER() OVER (ORDER BY totaldonecout DESC) AS 'rank',
        image AS 'profile_photo',
        name,
        totaldonecout AS 'total_donations'
      FROM ngo
      ORDER BY totaldonecout DESC
      LIMIT 10;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query failed' });
            throw err;
        }
        res.status(200).json(results);
    });
});

module.exports = router;