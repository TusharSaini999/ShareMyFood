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
//curl -X POST http://localhost:4000/auto/signup -H "Content-Type: application/json" -d "{\"name\":\"Tushar Saini\",\"email\":\"tushar.com\",\"phone\":\"1234567890\",\"password\":\"12345678\",\"usertype\":\"user\"}"
//curl -X POST http://localhost:4000/auto/signup -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"email\":\"johndoe@example.com\",\"phone\":\"1234567890\",\"password\":\"password123\",\"usertype\":\"ngo\"}"
router.post('/signup', async (req, res) => {
  const { name, email, phone, password, usertype } = req.body;

  if (!name || !email || !phone || !password || !usertype) {
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
        const insertQuery = `INSERT INTO ${table} (name, email, phone, password, usertype) VALUES (?, ?, ?, ?, ?)`;

        db.query(insertQuery, [name, email, phone, hashedPassword, usertype], (err, result) => {
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
//curl -X POST http://localhost:4000/auto/login -H "Content-Type: application/json" -d "{\"email\": \"tushar.com\", \"password\": \"12345678\"}"
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
            userType:user.usertype,
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
//curl -X GET http://localhost:4000/auto/profile -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImVtYWlsIjoidHVzaGFyLmNvbSIsInVzZXJ0eXBlIjoidXNlciIsImlhdCI6MTczOTQ2NDA3MywiZXhwIjoxNzM5NDY3NjczfQ.2DcIFmGo8JmRjgb8pTTqbBc8Al4z8PGVWU3BZ73pEKE"
router.get('/profile', verifyToken, (req, res) => {
  const { userId, usertype } = req.user; // User data comes from the decoded JWT token

  // If no userId or usertype, return an error
  if (!userId || !usertype) {
    return res.status(400).json({ message: 'Invalid request. User data is missing.' });
  }

  // Check the usertype to determine which table to query
  let profileQuery = '';
  if (usertype === 'ngo') {
    profileQuery = 'SELECT * FROM ngo WHERE id = ?';
  } else if (usertype === 'user') {
    profileQuery = 'SELECT * FROM users WHERE id = ?';
  } else {
    return res.status(400).json({ message: 'Invalid usertype' });
  }

  // Query the appropriate table based on usertype
  db.query(profileQuery, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Return the profile data
    res.status(200).json({
      message: 'Profile fetched successfully',
      profile: results[0],
    });
  });
});


//profile update
//curl -X PUT http://localhost:4000/auto/update-profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImVtYWlsIjoidHVzaGFyLmNvbSIsInVzZXJ0eXBlIjoidXNlciIsImlhdCI6MTczOTQ2NzI2OCwiZXhwIjoxNzM5NDcwODY4fQ.cgecdgg2EBAsxAl0kxThTj52AZUk4VPBunpYzS6q9lk" -F "name=John Doe" -F "phone=1234567890" -F "address=123 Main St, City, Country" -F "profilePhoto=@C:/Project/CampusEats/backend/images/1737258735376.png"

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sheremyfoodprofile',  
    format: async (req, file) => 'png', 
  },
});

const upload = multer({ storage });

router.put('/update-profile', verifyToken, upload.single('profilePhoto'), async (req, res) => {
  const { name, phone, address} = req.body;
  const userId = req.user.userId; // From the verified token
  const userTypeFromToken = req.user.usertype; // User type from JWT
  console.log(name, phone, address, req.file);

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

module.exports = router;

