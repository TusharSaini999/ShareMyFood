// Importing required modules
const express = require('express');
const router = express.Router();
const db = require("./db");
const jwt = require('jsonwebtoken');
require('dotenv').config();

//verfy token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Unauthorized, Invalid token format' });
    }

    const actualToken = tokenParts[1];

    jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired , Please Login!' });
            }
            return res.status(401).json({ message: 'Unauthorized', error: err });
        }

        req.user = decoded;
        next();
    });
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
const findNearbyNGOs = async (lat, lon) => {
    let radius = 30;
    let distance;
    let NGOs = [];

    const query = 'SELECT * FROM ngo';

    return new Promise((resolve, reject) => {
        db.query(query, (err, ngos) => {
            if (err) {
                reject('Error fetching NGOs from the database: ' + err);
            } else {
                let foundNGOs = [];


                for (const ngo of ngos) {
                    distance = calculateDistance(lat, lon, ngo.latitude, ngo.longitude);


                    if (distance <= radius && ngo.status === 'online') {
                        ngo.distance = distance;
                        foundNGOs.push(ngo);
                    }
                }


                while (foundNGOs.length === 0 && radius <= 400) {
                    radius *= 2;


                    for (const ngo of ngos) {
                        distance = calculateDistance(lat, lon, ngo.latitude, ngo.longitude);


                        if (distance <= radius && ngo.status === 'online') {
                            ngo.distance = distance;
                            foundNGOs.push(ngo);
                        }
                    }
                }


                foundNGOs.sort((a, b) => a.distance - b.distance);

                if (foundNGOs.length > 0) {
                    resolve(foundNGOs);
                } else {
                    reject('No online NGOs found within the extended search radius');
                }
            }
        });
    });
};


//donation api
//curl -X POST "http://localhost:4000/don/donation-request" -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJlbWFpbCI6InR1c2hhcnNhaW5pLmlkQGdtYWlsLmNvbSIsInVzZXJ0eXBlIjoidXNlciIsImlhdCI6MTczOTg5MzExMiwiZXhwIjoxNzM5ODk2NzEyfQ.9UCFOz-stUs3_pNJi1gtS7jROPrXsrUAEZvlRzTFsb8" -d "{\"name\": \"John Doe\", \"food_type\": \"Rice\", \"quantity\": 10, \"pickup_address\": \"123 XYZ Street, ABC City\", \"latitude\": 29.956013, \"longitude\": 77.619105, \"preferred_time\": \"2025-02-20T10:00:00\", \"contact_details\": \"9876543210\"}"


router.post('/donation-request', verifyToken, async (req, res) => {
    const { name, food_type, quantity, pickup_address, latitude, longitude, preferred_time, contact_details } = req.body;
    if (!name || !food_type || !quantity || !pickup_address || !latitude || !longitude || !preferred_time || !contact_details) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const nearbyNGOs = await findNearbyNGOs(latitude, longitude);

        if (nearbyNGOs.length === 0) {
            return res.status(404).json({ message: 'No NGOs found within the extended search radius' });
        }


        const ngoAssigned = nearbyNGOs[0].id;
        const ngoDistance = nearbyNGOs[0].distance;

        // Create the donation request
        const donationRequestQuery = 'INSERT INTO donation_requests (user_id, name, food_type, quantity, pickup_address, latitude, longitude, preferred_time, contact_details, ngo_assigned) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        db.query(donationRequestQuery, [req.user.userId, name, food_type, quantity, pickup_address, latitude, longitude, preferred_time, contact_details, ngoAssigned], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error creating donation request', error: err });
            }


            return res.status(200).json({
                message: 'Donation request created successfully',
                ngoAssigned: ngoAssigned,
                distance: ngoDistance
            });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error finding nearby NGOs', error: error });
    }
});


// API to fetch pending requests older than 20 minutes
//Activation page
//curl -X GET "http://localhost:4000/don/pending-donation-requests" -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJlbWFpbCI6InR1c2hhcnNhaW5pLmlkQGdtYWlsLmNvbSIsInVzZXJ0eXBlIjoidXNlciIsImlhdCI6MTczOTg5MzExMiwiZXhwIjoxNzM5ODk2NzEyfQ.9UCFOz-stUs3_pNJi1gtS7jROPrXsrUAEZvlRzTFsb8"

router.get('/pending-donation-requests', verifyToken, async (req, res) => {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString();
        const query = `
            SELECT * FROM donation_requests
            WHERE status = 'pending'
            AND created_at <= ?
        `;
        
        db.query(query, [fiveMinutesAgo], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching donation requests', error: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No pending donation requests older than 20 minutes' });
            }

            return res.status(200).json({ message: 'Pending donation requests fetched successfully', requests: results });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching pending donation requests', error: error });
    }
});


module.exports = router;