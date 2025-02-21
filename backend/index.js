const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const db = require("./db");
const cron = require("node-cron"); 
require("dotenv").config();
const { findNearbyNGOs } = require("./ngonerby");
const app = express();
const server = http.createServer(app); 
const io = socketIo(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

global.io = io;

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


const authentication = require("./autentication");
const topl = require("./nogleader");
const don = require("./donation");

app.use("/auto", authentication);
app.use("/top", topl);
app.use("/don", don);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});


cron.schedule("* * * * *", async () => {
  console.log("Checking for pending donations that need reassignment...");

  try {
      
      const pendingDonations = await new Promise((resolve, reject) => {
          db.query(
              `SELECT id, latitude, longitude, ngo_assigned FROM donation_requests 
               WHERE status = 'pending' 
               AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 5
               AND reassigned = 0`, 
              (err, res) => {
                  if (err) reject(err);
                  else resolve(res);
              }
          );
      });

      if (pendingDonations.length === 0) {
          console.log("No donations need reassignment.");
          return;
      }

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
                          (err, res) => {
                              if (err) reject(err);
                              else resolve(res);
                          }
                      );
                  });
              }

              
              await new Promise((resolve, reject) => {
                  db.query(
                      `UPDATE donation_requests SET ngo_assigned = ?, status = 'pending', reassigned = 1 WHERE id = ?`, 
                      [reassignedNGOs[0], donation.id],
                      (err, res) => {
                          if (err) reject(err);
                          else resolve(res);
                      }
                  );
              });

              console.log(`Successfully reassigned NGOs for donation ID: ${donation.id}`);

              
              io.emit("reassignDonationRequest", { donationId: donation.id, reassignedNGOs });
          } else {
              console.log(`No available NGOs for reassignment for donation ID: ${donation.id}`);
          }
      }
  } catch (error) {
      console.error("Error during NGO reassignment:", error);
  }
});



// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
