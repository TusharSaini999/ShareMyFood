const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const db = require("./db");
const cron = require("node-cron"); // Cron job for automatic reassignment
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket support
const io = socketIo(server, {
    cors: {
        origin: "*", // Adjust for security in production
        methods: ["GET", "POST"]
    }
});

global.io = io; // Make `io` globally accessible

const allowedOrigins = ["http://localhost:3000"];

// CORS Middleware
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

app.use("/auto", authentication);
app.use("/top", topl);
app.use("/don", don);

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

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

// Scheduled Cron Job to Reassign NGOs for Pending Donations
cron.schedule("* * * * *", async () => {
  console.log("🔄 Checking for pending donations that need reassignment...");

  try {
      // Fetch pending donations that have NOT been reassigned yet and are older than 5 minutes
      const pendingDonations = await new Promise((resolve, reject) => {
          db.query(
              `SELECT id, latitude, longitude, ngo_assigned FROM donation_requests 
               WHERE status = 'pending' 
               AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 5
               AND reassigned = 0`,  // Ensure reassignment happens only once
              (err, res) => {
                  if (err) reject(err);
                  else resolve(res);
              }
          );
      });

      if (pendingDonations.length === 0) {
          console.log("✅ No donations need reassignment.");
          return;
      }

      for (const donation of pendingDonations) {
          console.log(`♻️ Reassigning donation ID: ${donation.id}`);

          // Find 5 nearby NGOs, excluding the initially assigned NGO
          const nearbyNGOs = await findNearbyNGOs(donation.latitude, donation.longitude);
          const reassignedNGOs = nearbyNGOs
              .filter((ngo) => ngo.id !== donation.ngo_assigned) // Exclude the original NGO
              .slice(0, 5) // Get only the top 5
              .map((ngo) => ngo.id);

          if (reassignedNGOs.length > 0) {
              for (const newNgoId of reassignedNGOs) {
                  await new Promise((resolve, reject) => {
                      db.query(
                          `INSERT INTO donation_ngos (donation_id, ngo_id, status) VALUES (?, ?, 'pending')`, 
                          [donation.id, newNgoId],
                          (err, res) => {
                              if (err) reject(err);
                              else resolve(res);
                          }
                      );
                  });
              }

              // Update the donation request with the new NGO assignment and mark as reassigned
              await new Promise((resolve, reject) => {
                  db.query(
                      `UPDATE donation_requests SET ngo_assigned = ?, status = 'pending', reassigned = 1 WHERE id = ?`, 
                      [reassignedNGOs[0], donation.id], // Assign the first NGO from the new list
                      (err, res) => {
                          if (err) reject(err);
                          else resolve(res);
                      }
                  );
              });

              console.log(`✅ Successfully reassigned NGOs for donation ID: ${donation.id}`);

              // Notify the newly assigned NGOs via WebSocket
              io.emit("reassignDonationRequest", { donationId: donation.id, reassignedNGOs });
          } else {
              console.log(`❌ No available NGOs for reassignment for donation ID: ${donation.id}`);
          }
      }
  } catch (error) {
      console.error("❌ Error during NGO reassignment:", error);
  }
});



// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
