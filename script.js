require('dotenv').config();

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: "diib6xxxh",
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Log the configuration
console.log(cloudinary.config());