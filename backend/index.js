const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron"); 
require("dotenv").config();
const db = require("./db");
const { findNearbyNGOs } = require("./ngonerby");

const app = express();

const allowedOrigins = ["http://localhost:3000"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.use(bodyParser.json());

// Import Routes
const authentication = require("./autentication");
const topl = require("./nogleader");
const don = require("./donation");
const reqf = require("./reqfood");

app.use("/auto", authentication);
app.use("/top", topl);
app.use("/don", don);
app.use("/req", reqf);

cron.schedule("* * * * *", async () => {
  console.log("Checking for pending donations and food requests that need reassignment...");

  try {
    
    const pendingDonations = await new Promise((resolve, reject) => {
      db.query(
        `SELECT id, latitude, longitude, ngo_assigned 
         FROM donation_requests 
         WHERE status = 'pending' 
         AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 5
         AND reassigned = 0`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });

    if (pendingDonations.length > 0) {
      console.log(`Found ${pendingDonations.length} donation(s) needing reassignment.`);

      for (const donation of pendingDonations) {
        console.log(`Reassigning donation ID: ${donation.id}`);

        const nearbyNGOs = await findNearbyNGOs(donation.latitude, donation.longitude);
        const reassignedNGOs = nearbyNGOs
          .filter((ngo) => ngo.id !== donation.ngo_assigned)
          .slice(0, 5)
          .map((ngo) => ngo.id);

        if (reassignedNGOs.length > 0) {
          for (const newNgoId of reassignedNGOs) {
            await new Promise((resolve, reject) => {
              db.query(
                `INSERT INTO donation_ngos (donation_id, ngo_id, status) VALUES (?, ?, 'pending')`,
                [donation.id, newNgoId],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });
          }

          await new Promise((resolve, reject) => {
            db.query(
              `UPDATE donation_requests 
               SET ngo_assigned = ?, status = 'pending', reassigned = 1 
               WHERE id = ?`,
              [reassignedNGOs[0], donation.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          console.log(`Successfully reassigned NGOs for donation ID: ${donation.id}`);
        } else {
          console.log(`No available NGOs for reassignment for donation ID: ${donation.id}`);
        }
      }
    } else {
      console.log("No donations need reassignment.");
    }

    // 2️⃣ Check for pending food requests needing reassignment
    const pendingFoodRequests = await new Promise((resolve, reject) => {
      db.query(
        `SELECT id, latitude, longitude, ngo_assigned 
         FROM food_requests 
         WHERE status = 'pending' 
         AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 5
         AND reassigned = 0`,
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });

    if (pendingFoodRequests.length > 0) {
      console.log(`Found ${pendingFoodRequests.length} food request(s) needing reassignment.`);

      for (const request of pendingFoodRequests) {
        console.log(`Reassigning food request ID: ${request.id}`);

        const nearbyNGOs = await findNearbyNGOs(request.latitude, request.longitude);
        const reassignedNGOs = nearbyNGOs
          .filter((ngo) => ngo.id !== request.ngo_assigned)
          .slice(0, 5)
          .map((ngo) => ngo.id);

        if (reassignedNGOs.length > 0) {
          for (const newNgoId of reassignedNGOs) {
            await new Promise((resolve, reject) => {
              db.query(
                `INSERT INTO food_request_ngos (food_request_id, ngo_id, status) VALUES (?, ?, 'pending')`,
                [request.id, newNgoId],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });
          }

          await new Promise((resolve, reject) => {
            db.query(
              `UPDATE food_requests 
               SET ngo_assigned = ?, status = 'pending', reassigned = 1 
               WHERE id = ?`,
              [reassignedNGOs[0], request.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          console.log(`Successfully reassigned NGOs for food request ID: ${request.id}`);
        } else {
          console.log(`No available NGOs for reassignment for food request ID: ${request.id}`);
        }
      }
    } else {
      console.log("No food requests need reassignment.");
    }

  } catch (error) {
    console.error("Error during NGO reassignment:", error);
  }
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
