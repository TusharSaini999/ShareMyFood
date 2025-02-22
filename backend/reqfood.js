const express = require("express");
const db = require("./db");
const verifyToken = require("./authMiddleware");
const { findNearbyNGOs } = require("./ngonerby");
const { route } = require("./autentication");

const router = express.Router();

//food req
//curl -X POST "http://localhost:4000/req/food-request" -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJlbWFpbCI6InR1c2hhcnNhaW5pLmlkQGdtYWlsLmNvbSIsInVzZXJ0eXBlIjoidXNlciIsImlhdCI6MTc0MDE0OTUwMiwiZXhwIjoxNzQwMTUzMTAyfQ.FuxKSAjfdOCr6RbGUP9ro7ZCqPuhJ2szOjHhJjzJgXs" -d "{\"name\": \"John Doe\", \"food_type\": \"Rice\", \"quantity\": 10, \"pickup_address\": \"123 XYZ Street, ABC City\", \"latitude\": 29.956013, \"longitude\": 77.619105, \"preferred_time\": \"2025-02-20T10:00:00\", \"contact_details\": \"9876543210\", \"mes\": \"Need urgent food assistance\", \"total_count\": 5}"

router.post('/food-request', verifyToken, async (req, res) => {
    const { userId, usertype } = req.user;

    if (usertype !== "user") {
        return res.status(403).json({ message: "Only users can create food requests" });
    }

    const { name, food_type, quantity, pickup_address, latitude, longitude, preferred_time, contact_details, mes, total_count } = req.body;

    if (!name || !food_type || !quantity || !pickup_address || !latitude || !longitude || !preferred_time || !contact_details || !mes || !total_count) {
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
            INSERT INTO food_requests 
            (user_id, latitude, longitude, mes, ngo_assigned, status, reassigned, created_at, total_count) 
            VALUES (?, ?, ?, ?, ?, 'pending', 0, NOW(), ?)`;

        db.query(donationRequestQuery, [userId, latitude, longitude, mes, ngoAssigned, total_count], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error creating donation request", error: err });
            }

            const donationId = result.insertId;

            
            db.query(`INSERT INTO food_request_ngos (food_request_id, ngo_id, status) VALUES (?, ?, 'pending')`, [donationId, ngoAssigned], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error assigning NGO", error: err });
                }

                return res.status(200).json({
                    message: "Food request created successfully",
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

//api for activation page
//curl -X GET "http://localhost:4000/req/pending-food-requests" \ -H "Content-Type: application/json" \ -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJlbWFpbCI6InR1c2hhcnNhaW5pLmlkQGdtYWlsLmNvbSIsInVzZXJ0eXBlIjoidXNlciIsImlhdCI6MTc0MDIzMjM1OSwiZXhwIjoxNzQwMjM1OTU5fQ.3boSXzRQ9dgRqrnup86X_Kc21oNCQQKcghnb-IZiZRk"

router.get('/pending-food-requests', verifyToken, async (req, res) => {
    try {
        const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString();

        const query = `
            SELECT * FROM food_requests
            WHERE status = 'pending'
            AND created_at <= ?
        `;

        db.query(query, [twentyMinutesAgo], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching food requests', error: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No pending food requests older than 20 minutes' });
            }

            return res.status(200).json({ message: 'Pending food requests fetched successfully', requests: results });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching pending food requests', error: error });
    }
});

//api to get a ngo data
//curl -X GET "http://localhost:4000/req/food-requests-assigned" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJlbWFpbCI6ImNvbnRhY3RAY2FyZWZvcmFsbC5vcmciLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTc0MDIzMjY1MiwiZXhwIjoxNzQwMjM2MjUyfQ.TeeCgGXhfTkL2L2ySYwxOc8c8BkAky0VpbH5-CixFk4"
router.get("/food-requests-assigned", verifyToken, async (req, res) => {
    try {
        const { userId, usertype } = req.user;

        if (usertype !== "ngo") {
            return res.status(403).json({ message: "Access denied. Only NGOs can view assigned food requests." });
        }

        const query = `
            SELECT 
                frn.food_request_id, frn.status AS ngo_status, fr.status AS request_status, 
                fr.ngo_assigned AS initial_ngo, 
                fr.user_id, fr.latitude, fr.longitude, fr.mes, 
                fr.reassigned, fr.created_at, fr.total_count
            FROM food_request_ngos frn
            JOIN food_requests fr ON frn.food_request_id = fr.id
            WHERE frn.ngo_id = ?;
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "No assigned food requests found" });
            }

            const foodRequests = results.map(request => ({
                food_request_id: request.food_request_id,
                initial_ngo: request.initial_ngo,
                status: request.ngo_status === "accepted" ? request.request_status : request.ngo_status,
                user_id: request.user_id,
                latitude: request.latitude,
                longitude: request.longitude,
                mes: request.mes,
                reassigned: request.reassigned,
                created_at: request.created_at,
                total_count: request.total_count
            }));

            res.status(200).json({ message: "Assigned food requests fetched successfully", foodRequests });
        });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching assigned food requests", error });
    }
});

//accpte the food req
//curl -X POST "http://localhost:4000/req/accept-food-request" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJlbWFpbCI6ImNvbnRhY3RAY2FyZWZvcmFsbC5vcmciLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTc0MDIzMjY1MiwiZXhwIjoxNzQwMjM2MjUyfQ.TeeCgGXhfTkL2L2ySYwxOc8c8BkAky0VpbH5-CixFk4" -H "Content-Type: application/json" -d "{\"food_request_id\":1,\"contact_details\":\"9876543210\"}"
router.post("/accept-food-request", verifyToken, async (req, res) => {
    try {
        const { userId, usertype } = req.user; 
        const { food_request_id, contact_details } = req.body;

        if (usertype !== "ngo") {
            return res.status(403).json({ message: "Access denied. Only NGOs can accept food requests." });
        }

        if (!food_request_id || !contact_details) {
            return res.status(400).json({ message: "Food request ID and contact details are required" });
        }

        const checkQuery = `SELECT * FROM food_request_ngos WHERE food_request_id = ? AND ngo_id = ? AND status = 'pending'`;
        db.query(checkQuery, [food_request_id, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }
            if (results.length === 0) {
                return res.status(400).json({ message: "This NGO is not assigned or has already responded" });
            }

            const updateFoodRequest = `UPDATE food_requests SET status = 'accepted' WHERE id = ?`;
            db.query(updateFoodRequest, [food_request_id], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error updating food request", error: err });
                }

                const updateNGOQuery = `UPDATE food_request_ngos SET status = 'accepted', contact_details = ? WHERE food_request_id = ? AND ngo_id = ?`;
                db.query(updateNGOQuery, [contact_details, food_request_id, userId], (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error updating NGO status", error: err });
                    }

                    const updateOtherNGOs = `UPDATE food_request_ngos SET status = 'Accepted By Another NGO' WHERE food_request_id = ? AND ngo_id != ?`;
                    db.query(updateOtherNGOs, [food_request_id, userId], (err) => {
                        if (err) {
                            return res.status(500).json({ message: "Error updating other NGOs", error: err });
                        }

                        res.status(200).json({
                            message: "Food request accepted successfully",
                            food_request_id,
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

//user see all update
//curl -X GET "http://localhost:4000/req/user-food-requests" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJlbWFpbCI6InR1c2hhcnNhaW5pLmlkQGdtYWlsLmNvbSIsInVzZXJ0eXBlIjoidXNlciIsImlhdCI6MTc0MDIzMjM1OSwiZXhwIjoxNzQwMjM1OTU5fQ.3boSXzRQ9dgRqrnup86X_Kc21oNCQQKcghnb-IZiZRk" 
router.get("/user-food-requests", verifyToken, async (req, res) => {
    try {
        const { userId, usertype } = req.user; 

        if (usertype !== "user") {
            return res.status(403).json({ message: "Access denied. Only users can view their food requests." });
        }

        const query = `
            SELECT 
                fr.*, 
                frn.ngo_id, 
                n.name AS ngo_name,
                frn.contact_details AS ngo_contact
            FROM food_requests fr
            LEFT JOIN food_request_ngos frn ON fr.id = frn.food_request_id AND frn.status = 'accepted'
            LEFT JOIN ngo n ON frn.ngo_id = n.id
            WHERE fr.user_id = ?;
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "No food requests found for this user" });
            }

            res.status(200).json({ message: "User food requests fetched successfully", foodRequests: results });
        });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching user food requests", error });
    }
});

//complte api
//curl -X POST "http://localhost:4000/req/complete-food-request" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJlbWFpbCI6ImNvbnRhY3RAY2FyZWZvcmFsbC5vcmciLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTc0MDIzMzk1MSwiZXhwIjoxNzQwMjM3NTUxfQ.tA9Q1QzNeJ2hBBdmNmEzLZ_nuIp70L1wR6aKiLI_LFo" -H "Content-Type: application/json" -d "{\"food_request_id\":1}"
router.post("/complete-food-request", verifyToken, async (req, res) => {
    try {
        const { userId, usertype } = req.user;
        const { food_request_id } = req.body;

        if (usertype !== "ngo") {
            return res.status(403).json({ message: "Access denied. Only NGOs can complete food requests." });
        }

        const checkQuery = `
            SELECT frn.status, fr.status AS request_status
            FROM food_request_ngos frn
            JOIN food_requests fr ON frn.food_request_id = fr.id
            WHERE frn.food_request_id = ? AND frn.ngo_id = ? AND frn.status = 'accepted';
        `;

        db.query(checkQuery, [food_request_id, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (results.length === 0) {
                return res.status(403).json({ message: "Unauthorized. You are not assigned to this food request or it is not accepted." });
            }

            const updateFoodRequest = `UPDATE food_requests SET status = 'completed' WHERE id = ?`;

            db.query(updateFoodRequest, [food_request_id], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error updating food request status", error: err });
                }

                const updateNgoDonationCount = `UPDATE ngo SET totaldonecout = totaldonecout + 1 WHERE id = ?`;

                db.query(updateNgoDonationCount, [userId], (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error updating NGO donation count", error: err });
                    }

                    res.status(200).json({ message: "Food request marked as completed successfully", food_request_id });
                });
            });
        });

    } catch (error) {
        return res.status(500).json({ message: "Error processing request", error });
    }
});

//Api for reject
//curl -X POST "http://localhost:4000/req/reject-food-request" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJlbWFpbCI6ImNvbnRhY3RAY2FyZWZvcmFsbC5vcmciLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTc0MDIzMzk1MSwiZXhwIjoxNzQwMjM3NTUxfQ.tA9Q1QzNeJ2hBBdmNmEzLZ_nuIp70L1wR6aKiLI_LFo" -H "Content-Type: application/json" -d "{\"food_request_id\":1}"
router.post("/reject-food-request", verifyToken, async (req, res) => {
    try {
        const { userId, usertype } = req.user; 
        const { food_request_id } = req.body; 

        if (usertype !== "ngo") {
            return res.status(403).json({ message: "Access denied. Only NGOs can reject food requests." });
        }

        const checkQuery = `
            SELECT frn.status, fr.status AS request_status
            FROM food_request_ngos frn
            JOIN food_requests fr ON frn.food_request_id = fr.id
            WHERE frn.food_request_id = ? AND frn.ngo_id = ? AND frn.status = 'accepted';
        `;

        db.query(checkQuery, [food_request_id, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if (results.length === 0) {
                return res.status(403).json({ message: "Unauthorized. You are not assigned to this food request or it is not accepted." });
            }

            const updateFoodRequestQuery = `UPDATE food_requests SET status = 'canceled' WHERE id = ?`;

            db.query(updateFoodRequestQuery, [food_request_id], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error updating food request status", error: err });
                }

                res.status(200).json({ message: "Food request rejected successfully", food_request_id });
            });
        });

    } catch (error) {
        return res.status(500).json({ message: "Error processing request", error });
    }
});
module.exports = router;
