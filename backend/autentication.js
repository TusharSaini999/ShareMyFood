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


// Sign Up API
//curl -X POST http://localhost:4000/auto/signup -H "Content-Type: application/json" -d "{\"name\":\"Tushar Saini\",\"email\":\"tusharsaini.id@gmail.com\",\"phone\":\"1234567890\",\"password\":\"12345678\",\"usertype\":\"user\", \"address\":\"Abcd\"}"
//curl -X POST http://localhost:4000/auto/signup -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"email\":\"johndoe@example.com\",\"phone\":\"1234567890\",\"password\":\"password123\",\"usertype\":\"ngo\", \"address\":\"Abcd\", \"latitude\":28.7041, \"longitude\":77.1025}"

router.post('/signup', async (req, res) => {
  const { name, email, phone, password, usertype, address, latitude, longitude } = req.body;

  if (!name || !email || !phone || !password || !usertype || !address || (usertype.toLowerCase() === 'ngo' && (!latitude || !longitude))) {
    return res.status(400).json({ message: 'All fields are required, including latitude and longitude for NGO' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  try {
    const table = usertype.toLowerCase() === 'ngo' ? 'ngo' : 'users';

    const checkUsersQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUsersQuery, [email], async (err, userResults) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      if (userResults.length > 0) return res.status(400).json({ message: 'User already exists in users table' });

      const checkNgoQuery = 'SELECT * FROM ngo WHERE email = ?';
      db.query(checkNgoQuery, [email], async (err, ngoResults) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (ngoResults.length > 0) return res.status(400).json({ message: 'User already exists in NGO table' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = `INSERT INTO ${table} (name, email, phone, password, usertype, address${usertype.toLowerCase() === 'ngo' ? ', latitude, longitude' : ''}) VALUES (?, ?, ?, ?, ?, ?${usertype.toLowerCase() === 'ngo' ? ', ?, ?' : ''})`;

        const values = usertype.toLowerCase() === 'ngo' ? [name, email, phone, hashedPassword, usertype, address, latitude, longitude] : [name, email, phone, hashedPassword, usertype, address];

        db.query(insertQuery, values, (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });

          const payload = { userId: result.insertId, email, usertype };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

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
//curl -X POST http://localhost:4000/auto/login -H "Content-Type: application/json" -d "{\"email\": \"tusharsaini.id@gmail.com\", \"password\": \"12345678\"}"
//curl -X POST http://localhost:4000/auto/login -H "Content-Type: application/json" -d "{\"email\": \"contact@careforall.org\", \"password\": \"12345678\"}"

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    
    const checkNgoQuery = 'SELECT * FROM ngo WHERE email = ?';
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';

    
    db.query(checkNgoQuery, [email], async (err, ngoResults) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (ngoResults.length > 0) {
        const ngo = ngoResults[0];

        
        const match = await bcrypt.compare(password, ngo.password);
        if (!match) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }

        
        const payload = { userId: ngo.id, email, usertype: 'ngo' };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
          message: 'Login successful',
          userId: ngo.id,
          userType: ngo.usertype,
          token
        });
      }

      
      db.query(checkUserQuery, [email], async (err, userResults) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        if (userResults.length > 0) {
          const user = userResults[0];

          
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return res.status(400).json({ message: 'Invalid email or password' });
          }

          
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
//curl -X GET http://localhost:4000/auto/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI0LCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTczOTg4NDcxOSwiZXhwIjoxNzM5ODg4MzE5fQ.nUk7N9d0ktMXwqH2CeLqiw43Xq_jLD5JLBWtSehpyqs"
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
        const rankQuery = `SELECT COUNT(*) AS total FROM ngo`;
        db.query(rankQuery, (err, rankResults) => {
          if (err) return res.status(500).json({ message: 'Error calculating rank', error: err });

          const rank = rankResults[0].total;

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
              rank: rank,
              latitude: ngo.latitude,      
              longitude: ngo.longitude     
            }
          });
        });
      } else {
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
              rank: rank,
              latitude: ngo.latitude,      
              longitude: ngo.longitude     
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

//curl -X POST "http://localhost:4000/auto/send-otp" -H "Content-Type: application/json" -d "{\"email\":\"contact@careforall.org\"}"

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    
    const emailExists = await checkEmailInTables(email);
    if (!emailExists) {
      return res.status(404).json({ error: 'Email not found in ngo or users table' });
    }

    const otp = generateOTP();

    
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


//curl -X POST "http://localhost:4000/auto/verify-otp-and-reset-password" -H "Content-Type: application/json" -d "{\"email\":\"contact@careforall.org\", \"otp\":\"627603\", \"newPassword\":\"12345678\"}"

router.post('/verify-otp-and-reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required' });
  }

 
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  try {
    
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

      
      const emailResult = await checkEmailInTables(email);
      if (!emailResult) {
        return res.status(404).json({ error: 'Email not found in ngo or users table' });
      }

      
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      
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
    format: async (req, file) => 'webp',  
    transformation: [
      { width: 1000, crop: "scale" },
      { quality: "auto" },
      { fetch_format: "auto" }          
    ]
  },
});


const upload = multer({ storage });

router.put('/update-profile', verifyToken, upload.single('profilePhoto'), async (req, res) => {
  const { name, phone, address, latitude, longitude } = req.body;  
  const userId = req.user.userId;
  const userTypeFromToken = req.user.usertype;

  if (!name || !phone || !address || (userTypeFromToken === 'ngo' && (!latitude || !longitude))) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    let profileImage = req.file ? req.file.path : null;

    let query = '';
    let params = [];
    const table = userTypeFromToken === 'ngo' ? 'ngo' : 'users';

    if (userTypeFromToken === 'ngo') {
      query = `
        UPDATE ${table} 
        SET name = ?, phone = ?, address = ?, latitude = ?, longitude = ?, image = COALESCE(?, image)
        WHERE id = ?`;
      params = [name, phone, address, latitude, longitude, profileImage, userId];
    } else {
      query = `
        UPDATE ${table} 
        SET name = ?, phone = ?, address = ?, image = COALESCE(?, image)
        WHERE id = ?`;
      params = [name, phone, address, profileImage, userId];
    }

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
      ...(userTypeFromToken === 'ngo' && { latitude, longitude })
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
  const query = 'INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)';
  db.query(query, [name, email, message], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

   
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

//Toggle the Current
//curl -X PATCH http://localhost:4000/auto/status/24 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI0LCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJ1c2VydHlwZSI6Im5nbyIsImlhdCI6MTczOTg4NDcxOSwiZXhwIjoxNzM5ODg4MzE5fQ.nUk7N9d0ktMXwqH2CeLqiw43Xq_jLD5JLBWtSehpyqs"

router.patch('/status/:id', verifyToken, (req, res) => {
  const ngoId = req.params.id;

  // Query to get the current status of the NGO
  const query = 'SELECT status FROM ngo WHERE id = ?';

  db.query(query, [ngoId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    const currentStatus = result[0].status;
    const newStatus = currentStatus === 'online' ? 'offline' : 'online';

    // Update the status in the database
    const updateQuery = 'UPDATE ngo SET status = ? WHERE id = ?';

    db.query(updateQuery, [newStatus, ngoId], (err, updateResult) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating status' });
      }

      res.status(200).json({
        message: `NGO status updated to ${newStatus}`,
        status: newStatus,
      });
    });
  });
});
module.exports = router;