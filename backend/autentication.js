// Importing required modules
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require("./db");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cloudinary = require('./config');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
//verfy token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Remove the 'Bearer ' part if it exists, so only the token is passed to jwt.verify
  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized, Invalid token format' });
  }

  const actualToken = tokenParts[1];  // The token without 'Bearer' prefix

  jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired , Please Login!' });
      }
      return res.status(401).json({ message: 'Unauthorized', error: err });
    }

    req.user = decoded; // Attach the decoded payload to the request object
    next();
  });
};


// Sign Up API
//curl -X POST http://localhost:4000/auto/signup -H "Content-Type: application/json" -d "{\"name\":\"Tushar Saini\",\"email\":\"tusharsaini.i@gmail.com\",\"phone\":\"1234567890\",\"password\":\"12345678\",\"usertype\":\"user\", \"address\":\"Abcd\"}"
//curl -X POST http://localhost:4000/auto/signup -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"email\":\"johndoe@example.com\",\"phone\":\"1234567890\",\"password\":\"password123\",\"usertype\":\"ngo\", \"address\":\"Abcd\"}"
router.post('/signup', async (req, res) => {
  const { name, email, phone, password, usertype, address } = req.body;

  if (!name || !email || !phone || !password || !usertype || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  try {
    // Determine the table based on usertype
    const table = usertype.toLowerCase() === 'ngo' ? 'ngo' : 'users';

    // Check if user already exists in 'users' table
    const checkUsersQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUsersQuery, [email], async (err, userResults) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (userResults.length > 0) {
        return res.status(400).json({ message: 'User already exists in users table' });
      }

      // Check if user already exists in 'ngo' table
      const checkNgoQuery = 'SELECT * FROM ngo WHERE email = ?';
      db.query(checkNgoQuery, [email], async (err, ngoResults) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        if (ngoResults.length > 0) {
          return res.status(400).json({ message: 'User already exists in NGO table' });
        }

        // Hash password and insert user into the appropriate table
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = `INSERT INTO ${table} (name, email, phone, password, usertype, address) VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(insertQuery, [name, email, phone, hashedPassword, usertype, address], (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
          }

          // Create JWT token after user registration
          const payload = { userId: result.insertId, email, usertype };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

          // Send response with the token
          res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
            token,
            usertype
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});



//login
//curl -X POST http://localhost:4000/auto/login -H "Content-Type: application/json" -d "{\"email\": \"tusharsaini.in@gmail.com\", \"password\": \"12345678\"}"
//curl -X POST http://localhost:4000/auto/login -H "Content-Type: application/json" -d "{\"email\": \"ngo1@example.com\", \"password\": \"pass1234\"}"

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Determine the table to check based on the email
    const checkNgoQuery = 'SELECT * FROM ngo WHERE email = ?';
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';

    // Check if the user exists in 'ngo' table first
    db.query(checkNgoQuery, [email], async (err, ngoResults) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (ngoResults.length > 0) {
        const ngo = ngoResults[0];

        // Compare the password with the stored hash
        const match = await bcrypt.compare(password, ngo.password);
        if (!match) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT token for ngo
        const payload = { userId: ngo.id, email, usertype: 'ngo' };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
          message: 'Login successful',
          userId: ngo.id,
          userType: ngo.usertype,
          token
        });
      }

      // If not found in 'ngo' table, check in 'users' table
      db.query(checkUserQuery, [email], async (err, userResults) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        if (userResults.length > 0) {
          const user = userResults[0];

          // Compare the password with the stored hash
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return res.status(400).json({ message: 'Invalid email or password' });
          }

          // Create JWT token for user
          const payload = { userId: user.id, email, usertype: 'user' };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

          return res.status(200).json({
            message: 'Login successful',
            userId: user.id,
            userType: user.usertype,
            token
          });
        }

        return res.status(400).json({ message: 'Invalid email or password' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

//profile data
//curl -X GET http://localhost:4000/auto/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTczOTcxNjY3MCwiZXhwIjoxNzM5NzIwMjcwfQ.g2KqqXH2OM29RhjSOqnU4lSvQRPJYKSMucpMUSum-fI"
// Profile route with separate queries for NGO and User
router.get('/profile', verifyToken, (req, res) => {
  const { userId, usertype } = req.user;

  if (!userId || !usertype) {
    return res.status(400).json({ message: 'Invalid request. User data is missing.' });
  }

  if (usertype === 'ngo') {
    const ngoQuery = 'SELECT * FROM ngo WHERE id = ?';
    db.query(ngoQuery, [userId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      if (results.length === 0) return res.status(404).json({ message: 'NGO profile not found' });

      const ngo = results[0];

      if (ngo.totaldonecout === 0) {
        // If totaldonecout is 0, the rank is simply the count of all NGOs
        const rankQuery = `SELECT COUNT(*) AS total FROM ngo`;
        db.query(rankQuery, (err, rankResults) => {
          if (err) return res.status(500).json({ message: 'Error calculating rank', error: err });

          const rank = rankResults[0].total; // The rank for NGOs with 0 donations is the total count of NGOs

          res.status(200).json({
            message: 'NGO profile fetched successfully',
            profile: {
              id: ngo.id,
              name: ngo.name,
              email: ngo.email,
              phone: ngo.phone,
              address: ngo.address,
              image: ngo.image,
              totaldonecout: ngo.totaldonecout,
              rank: rank
            }
          });
        });
      } else {
        // Calculate rank for NGOs with donations
        const rankQuery = `
          SELECT (COUNT(*) + 1) AS ngo_rank
          FROM ngo
          WHERE totaldonecout > (SELECT totaldonecout FROM ngo WHERE id = ?)
        `;
        db.query(rankQuery, [userId], (err, rankResults) => {
          if (err) return res.status(500).json({ message: 'Error calculating rank', error: err });

          const rank = rankResults[0].ngo_rank;

          res.status(200).json({
            message: 'NGO profile fetched successfully',
            profile: {
              id: ngo.id,
              name: ngo.name,
              email: ngo.email,
              phone: ngo.phone,
              address: ngo.address,
              image: ngo.image,
              totaldonecout: ngo.totaldonecout,
              rank: rank
            }
          });
        });
      }
    });
  } else if (usertype === 'user') {
    const userQuery = 'SELECT * FROM users WHERE id = ?';
    db.query(userQuery, [userId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      if (results.length === 0) return res.status(404).json({ message: 'User profile not found' });

      const user = results[0];
      res.status(200).json({
        message: 'User profile fetched successfully',
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          image: user.image,
          usertype: user.usertype
        }
      });
    });
  } else {
    return res.status(400).json({ message: 'Invalid usertype' });
  }
});



//forgat password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.pass
  }
});

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Function to check email in ngo or users table
function checkEmailInTables(email) {
  return new Promise((resolve, reject) => {
    const ngoQuery = 'SELECT id FROM ngo WHERE email = ?';
    const usersQuery = 'SELECT id FROM users WHERE email = ?';

    db.query(ngoQuery, [email], (ngoErr, ngoResults) => {
      if (ngoErr) return reject(ngoErr);

      if (ngoResults.length > 0) {
        return resolve({ table: 'ngo', id: ngoResults[0].id });
      }

      db.query(usersQuery, [email], (usersErr, usersResults) => {
        if (usersErr) return reject(usersErr);

        if (usersResults.length > 0) {
          return resolve({ table: 'users', id: usersResults[0].id });
        }

        resolve(null); // Email not found
      });
    });
  });
}

//curl -X POST "http://localhost:4000/auto/send-otp" -H "Content-Type: application/json" -d "{\"email\":\"tusharsaini.in@gmail.com\"}"

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if email exists
    const emailExists = await checkEmailInTables(email);
    if (!emailExists) {
      return res.status(404).json({ error: 'Email not found in ngo or users table' });
    }

    const otp = generateOTP();

    // Save OTP to Database
    const query = `
      INSERT INTO otp_verification (email, otp) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE otp = ?, created_at = CURRENT_TIMESTAMP
    `;
    db.query(query, [email, otp, otp], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      // Send Email with OTP
      const mailOptions = {
        from: process.env.email,
        to: email,
        subject: 'SheremyFood OTP Verification',
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  color: #333333;
                }
                .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #4CAF50;
                  text-align: center;
                  margin: 20px 0;
                }
                .warning {
                  font-size: 16px;
                  font-weight: bold;
                  color: #FF6347; /* Tomato color for warning */
                  background-color: #FFF8E1; /* Light yellow background */
                  padding: 10px;
                  border-radius: 5px;
                  text-align: center;
                  margin-bottom: 20px;
                }
                .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777777;
                  margin-top: 40px;
                }
                .footer a {
                  color: #4CAF50;
                  text-decoration: none;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Your OTP for SheremyFood password reset</h1>
                </div>
                <div class="warning">
                  <strong>Warning:</strong> This OTP is time-sensitive. Please use it within 5 minutes. <br>
                  <strong>Do not share this OTP with anyone.</strong> If someone else has access to this OTP, they could change your password.
                </div>
                <div class="otp">
                  ${otp}
                </div>
                <div class="footer">
                  <p>It is valid for 5 minutes.</p>
                  <p>If you did not request a password reset, please ignore this email.</p>
                  <p>If you have any questions, please visit our <a href="https://www.sheremyfood.com/faq" target="_blank">FAQ page</a> or contact support.</p>
                  <p>Contact Support: <a href="mailto:support@sheremyfood.com">support@sheremyfood.com</a></p>
                </div>
              </div>
            </body>
          </html>
        `
      };



      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ error: 'Error sending email', details: error.message });
        }
        res.status(200).json({ message: 'OTP sent successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error checking email existence', details: error.message });
  }
});


//curl -X POST "http://localhost:4000/auto/verify-otp-and-reset-password" -H "Content-Type: application/json" -d "{\"email\":\"tusharsaini.in@gmail.com\", \"otp\":\"934363\", \"newPassword\":\"12345678\"}"

router.post('/verify-otp-and-reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required' });
  }

  // Check if the new password is at least 8 characters long
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  try {
    // Check OTP validity
    const otpQuery = `
      SELECT * FROM otp_verification 
      WHERE email = ? AND otp = ? 
      AND created_at >= NOW() - INTERVAL 5 MINUTE
    `;
    db.query(otpQuery, [email, otp], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // Check email in tables
      const emailResult = await checkEmailInTables(email);
      if (!emailResult) {
        return res.status(404).json({ error: 'Email not found in ngo or users table' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in the respective table
      const updateQuery = `UPDATE ${emailResult.table} SET password = ? WHERE id = ?`;
      db.query(updateQuery, [hashedPassword, emailResult.id], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: 'Error updating password', details: updateErr.message });
        }

        res.status(200).json({ message: 'Password updated successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});


//profile update
//curl -X PUT http://localhost:4000/auto/update-profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoidHVzaGFyc2FpbmkuaW5AZ21haWwuY29tIiwidXNlcnR5cGUiOiJ1c2VyIiwiaWF0IjoxNzM5NjMyNDc5LCJleHAiOjE3Mzk2MzYwNzl9.Tu3pVM1APjyDmjFtlZpNXrNhlo2x3lK6Yi84ktYYYy8" -F "name=John Doe" -F "phone=1234567890" -F "address=123 Main St, City, Country" -F "profilePhoto=@C:/Project/CampusEats/backend/images/1737258735376.png"

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sheremyfoodprofile',
    format: async (req, file) => 'webp',  // Use WebP for optimization
    transformation: [
      { width: 1000, crop: "scale" },
      { quality: "auto" },
      { fetch_format: "auto" }          // Auto format for best performance
    ]
  },
});


const upload = multer({ storage });

router.put('/update-profile', verifyToken, upload.single('profilePhoto'), async (req, res) => {
  const { name, phone, address } = req.body;
  const userId = req.user.userId; // From the verified token
  const userTypeFromToken = req.user.usertype;

  if (!name || !phone || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // If profile photo is provided, Cloudinary will handle the upload
    let profileImage = req.file ? req.file.path : null; // If file is uploaded, get Cloudinary URL

    // Update user information based on user type (users, vendors, delivery boys)
    let query = '';
    let params = [];

    const table = userTypeFromToken === 'ngo' ? 'ngo' : 'users';  // Select the correct table based on userType
    query = `
      UPDATE ${table} 
      SET name = ?, phone = ?, address = ?, image = COALESCE(?, image)
      WHERE id = ?`;
    params = [name, phone, address, profileImage, userId];

    const [response] = await db.promise().query(query, params);

    if (response.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      userId: userId,
      name: name,
      phone: phone,
      address: address,
      profilePhoto: profileImage,
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return res.status(500).json({ message: 'Failed to update profile', error });
  }
});


//contectus 
//curl -X POST http://localhost:4000/auto/contact -H "Content-Type: application/json" -d "{\"name\":\"Tushar Saini\",\"email\":\"tusharsaini.in@gmail.com\",\"message\":\"I  your SheremyFood platform!\"}" 
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Store data in database
  const query = 'INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)';
  db.query(query, [name, email, message], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    // Email to user
    const userMail = {
      from: process.env.email,
      to: email,
      subject: 'Thank you for contacting us!',
      html: `
        <div style="background-color: #FF6B35; padding: 20px; font-family: Arial, sans-serif; color: white;">
          <h1 style="text-align: center; margin-bottom: 20px;">Thank You for Contacting Us!</h1>
          <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p>We have received your message:</p>
          <blockquote style="background-color: white; color: #FF6B35; padding: 15px; border-radius: 8px;">
            ${message}
          </blockquote>
          <p>We will get back to you soon.</p>
          <p style="margin-top: 20px;">Best regards,</p>
          <p><strong>ShereMyFood Team</strong></p>
          <footer style="text-align: center; margin-top: 30px; font-size: 14px;">
            &copy; 2025 ShereMyFood | All rights reserved.
          </footer>
        </div>
      `
    };


    // Email to admin (your own email)
    const adminMail = {
      from: process.env.email,
      to: process.env.email,
      subject: 'New Contact Us Submission',
      html: `
        <div style="background-color: #FF6B35; padding: 20px; font-family: Arial, sans-serif; color: white;">
          <h2 style="text-align: center; margin-bottom: 20px;">New Contact Us Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background-color: white; color: #FF6B35; padding: 15px; border-radius: 8px;">
            ${message}
          </blockquote>
          <p style="margin-top: 20px;">This message was sent from the ShereMyFood Contact Us form.</p>
          <footer style="text-align: center; margin-top: 30px; font-size: 14px;">
            &copy; 2025 ShereMyFood | All rights reserved.
          </footer>
        </div>
      `
    };


    transporter.sendMail(userMail, (error, info) => {
      if (error) return res.status(500).json({ message: 'Failed to send email to user', error });

      transporter.sendMail(adminMail, (err, info) => {
        if (err) return res.status(500).json({ message: 'Failed to send email to admin', error });

        res.status(200).json({ message: 'Message received, emails sent successfully!' });
      });
    });
  });
});
module.exports = router;

