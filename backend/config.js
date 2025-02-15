require("dotenv").config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud,
  api_key: process.env.api,
  api_secret: process.env.apikey,
});

module.exports = cloudinary;
