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
//curl -X POST "http://localhost:4000/don/donation-request" -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJlbWFpbCI6InR1c2hhcnNhaW5pLmlkQGdtYWlsLmNvbSIsInVzZXJ0eXBlIjoidXNlciIsImlhdCI6MTc0MDA0MjM4NiwiZXhwIjoxNzQwMDQ1OTg2fQ.PlLjHk8_Om7ybPpLoMTOSyj6RdPy_iH0h6EjjieMw3E" -d "{\"name\": \"John Doe\", \"food_type\": \"Rice\", \"quantity\": 10, \"pickup_address\": \"123 XYZ Street, ABC City\", \"latitude\": 29.956013, \"longitude\": 77.619105, \"preferred_time\": \"2025-02-20T10:00:00\", \"contact_details\": \"9876543210\"}"

router.post('/donation-request', verifyToken, async (req, res) => {
    const { userId, usertype } = req.user;

    if (usertype !== "user") {
        return res.status(403).json({ message: "Only users can create donation requests" });
    }

    const { name, food_type, quantity, pickup_address, latitude, longitude, preferred_time, contact_details } = req.body;

    if (!name || !food_type || !quantity || !pickup_address || !latitude || !longitude || !preferred_time || !contact_details) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const nearbyNGOs = await findNearbyNGOs(latitude, longitude);

        if (nearbyNGOs.length === 0) {
            return res.status(404).json({ message: "No NGOs found within the extended search radius" });
        }

        const ngoAssigned = nearbyNGOs[0].id; 
        const ngoDistance = nearbyNGOs[0].distance;

        
        const donationRequestQuery = `
            INSERT INTO donation_requests 
            (user_id, name, food_type, quantity, pickup_address, latitude, longitude, preferred_time, contact_details, ngo_assigned, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

        db.query(donationRequestQuery, [userId, name, food_type, quantity, pickup_address, latitude, longitude, preferred_time, contact_details, ngoAssigned], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error creating donation request", error: err });
            }

            const donationId = result.insertId;

            
            db.query(`INSERT INTO donation_ngos (donation_id, ngo_id, status) VALUES (?, ?, 'pending')`, [donationId, ngoAssigned], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error assigning NGO", error: err });
                }

                return res.status(200).json({
                    message: "Donation request created successfully",
                    donationId,
                    ngoAssigned,
                    distance: ngoDistance
                });
            });
        });

    } catch (error) {
        return res.status(500).json({ message: "Error finding nearby NGOs", error });
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

//api for pending req inititall ngo
//curl -X GET "http://localhost:4000/don/donations-assigned" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJlbWFpbCI6ImNvbnRhY3RAY2FyZWZvcmFsbC5vcmciLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTc0MDAzOTIxMywiZXhwIjoxNzQwMDQyODEzfQ.jqat41mLwgeWHugJWRW2duuSKETsvtSImhKEBSjMPco"

router.get("/donations-assigned", verifyToken, async (req, res) => {
    try {
        const { userId, usertype } = req.user;

        if (usertype !== "ngo") {
            return res.status(403).json({ message: "Access denied. Only NGOs can view assigned donations." });
        }

        const query = `
            SELECT 
                dn.donation_id, dn.status AS ngo_status, dr.status AS donation_status, 
                dr.ngo_assigned AS initial_ngo, 
                dr.name, dr.food_type, dr.quantity, dr.pickup_address, dr.latitude, 
                dr.longitude, dr.preferred_time, dr.contact_details, dr.created_at
            FROM donation_ngos dn
            JOIN donation_requests dr ON dn.donation_id = dr.id
            WHERE dn.ngo_id = ?;
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "No assigned donations found" });
            }

            const donations = results.map(donation => ({
                donation_id: donation.donation_id,
                initial_ngo: donation.initial_ngo, 
                status: donation.ngo_status === "accepted" ? donation.donation_status : donation.ngo_status,
                name: donation.name,
                food_type: donation.food_type,
                quantity: donation.quantity,
                pickup_address: donation.pickup_address,
                latitude: donation.latitude,
                longitude: donation.longitude,
                preferred_time: donation.preferred_time,
                contact_details: donation.contact_details,
                created_at: donation.created_at
            }));

            res.status(200).json({ message: "Assigned donations fetched successfully", donations });
        });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching assigned donations", error });
    }
});


//accptet the req
//curl -X POST "http://localhost:4000/don/accept-donation" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJlbWFpbCI6ImNvbnRhY3RAY2FyZWZvcmFsbC5vcmciLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTc0MDA0MzQ2MCwiZXhwIjoxNzQwMDQ3MDYwfQ.OAZb6Si5TNlEowM5ID6nSohOgFddKM80M-Ri0xbp76I" -H "Content-Type: application/json" -d "{\"donation_id\":14,\"contact_details\":\"9876543210\"}"

router.post("/accept-donation", verifyToken, async (req, res) => {
    try {
        const { userId, usertype } = req.user; 
        const { donation_id, contact_details } = req.body;

        if (usertype !== "ngo") {
            return res.status(403).json({ message: "Access denied. Only NGOs can accept donations." });
        }

        if (!donation_id || !contact_details) {
            return res.status(400).json({ message: "Donation ID and contact details are required" });
        }

        const checkQuery = `SELECT * FROM donation_ngos WHERE donation_id = ? AND ngo_id = ? AND status = 'pending'`;
        db.query(checkQuery, [donation_id, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }
            if (results.length === 0) {
                return res.status(400).json({ message: "This NGO is not assigned or has already responded" });
            }

            const updateDonationRequest = `UPDATE donation_requests SET status = 'accepted' WHERE id = ?`;
            db.query(updateDonationRequest, [donation_id], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error updating donation request", error: err });
                }

                const updateNGOQuery = `UPDATE donation_ngos SET status = 'accepted', contact_details = ? WHERE donation_id = ? AND ngo_id = ?`;
                db.query(updateNGOQuery, [contact_details, donation_id, userId], (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error updating NGO status", error: err });
                    }

                    const updateOtherNGOs = `UPDATE donation_ngos SET status = 'Accepted By Another NGO' WHERE donation_id = ? AND ngo_id != ?`;
                    db.query(updateOtherNGOs, [donation_id, userId], (err) => {
                        if (err) {
                            return res.status(500).json({ message: "Error updating other NGOs", error: err });
                        }

                        res.status(200).json({
                            message: "Donation request accepted successfully",
                            donation_id,
                            accepted_by: userId,
                            contact_details
                        });
                    });
                });
            });
        });

    } catch (error) {
        return res.status(500).json({ message: "Error processing request", error });
    }
});


//user veiw here see all update to users
//curl -X GET "http://localhost:4000/don/user-donations" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJlbWFpbCI6InR1c2hhcnNhaW5pLmlkQGdtYWlsLmNvbSIsInVzZXJ0eXBlIjoidXNlciIsImlhdCI6MTc0MDA0MjM4NiwiZXhwIjoxNzQwMDQ1OTg2fQ.PlLjHk8_Om7ybPpLoMTOSyj6RdPy_iH0h6EjjieMw3E"
router.get("/user-donations", verifyToken, async (req, res) => {
    try {
        const { userId, usertype } = req.user; 

        
        if (usertype !== "user") {
            return res.status(403).json({ message: "Access denied. Only users can view their donations." });
        }

        
        const query = `
            SELECT 
                dr.*, 
                dn.ngo_id, 
                n.name AS ngo_name,
                dn.contact_details AS ngo_contact
            FROM donation_requests dr
            LEFT JOIN donation_ngos dn ON dr.id = dn.donation_id AND dn.status = 'accepted'
            LEFT JOIN ngo n ON dn.ngo_id = n.id
            WHERE dr.user_id = ?;
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "No donations found for this user" });
            }

            res.status(200).json({ message: "User donations fetched successfully", donations: results });
        });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching user donations", error });
    }
});

//complte the donation
//curl -X POST "http://localhost:4000/don/complete-donation" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJlbWFpbCI6ImNvbnRhY3RAY2FyZWZvcmFsbC5vcmciLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTc0MDA0MzQ2MCwiZXhwIjoxNzQwMDQ3MDYwfQ.OAZb6Si5TNlEowM5ID6nSohOgFddKM80M-Ri0xbp76I" -H "Content-Type: application/json" -d "{\"donation_id\":12}"

router.post("/complete-donation", verifyToken, async (req, res) => {
    try {
        const { userId, usertype } = req.user; 
        const { donation_id } = req.body; 

        
        if (usertype !== "ngo") {
            return res.status(403).json({ message: "Access denied. Only NGOs can complete donations." });
        }

        
        const checkQuery = `
            SELECT dn.status, dr.status AS donation_status
            FROM donation_ngos dn
            JOIN donation_requests dr ON dn.donation_id = dr.id
            WHERE dn.donation_id = ? AND dn.ngo_id = ? AND dn.status = 'accepted';
        `;

        db.query(checkQuery, [donation_id, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (results.length === 0) {
                return res.status(403).json({ message: "Unauthorized. You are not assigned to this donation or it is not accepted." });
            }

            const { donation_status } = results[0];

            
            if (donation_status !== "accepted") {
                return res.status(400).json({ message: "Donation must be in 'accepted' status to mark as completed." });
            }

            
            const updateDonationQuery = `UPDATE donation_requests SET status = 'completed' WHERE id = ?`;

            db.query(updateDonationQuery, [donation_id], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error updating donation status", error: err });
                }

                res.status(200).json({ message: "Donation request marked as completed successfully", donation_id });
            });
        });

    } catch (error) {
        return res.status(500).json({ message: "Error processing request", error });
    }
});

//Rejected No Respose the donation
//curl -X POST "http://localhost:4000/don/reject-donation" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJlbWFpbCI6ImNvbnRhY3RAY2FyZWZvcmFsbC5vcmciLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTc0MDA0MzQ2MCwiZXhwIjoxNzQwMDQ3MDYwfQ.OAZb6Si5TNlEowM5ID6nSohOgFddKM80M-Ri0xbp76I" -H "Content-Type: application/json" -d "{\"donation_id\":13}"
router.post("/reject-donation", verifyToken, async (req, res) => {
    try {
        const { userId, usertype } = req.user; 
        const { donation_id } = req.body; 

        
        if (usertype !== "ngo") {
            return res.status(403).json({ message: "Access denied. Only NGOs can reject donations." });
        }

        
        const checkQuery = `
            SELECT dn.status, dr.status AS donation_status
            FROM donation_ngos dn
            JOIN donation_requests dr ON dn.donation_id = dr.id
            WHERE dn.donation_id = ? AND dn.ngo_id = ? AND dn.status = 'accepted';
        `;

        db.query(checkQuery, [donation_id, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (results.length === 0) {
                return res.status(403).json({ message: "Unauthorized. You are not assigned to this donation or it is not accepted." });
            }

            const { donation_status } = results[0];

            
            if (donation_status !== "accepted") {
                return res.status(400).json({ message: "Donation must be in 'accepted' status to be rejected." });
            }

            
            const updateDonationQuery = `UPDATE donation_requests SET status = 'canceled' WHERE id = ?`;

            db.query(updateDonationQuery, [donation_id], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error updating donation status", error: err });
                }

                res.status(200).json({ message: "Donation request rejected successfully", donation_id });
            });
        });

    } catch (error) {
        return res.status(500).json({ message: "Error processing request", error });
    }
});

module.exports = router;
