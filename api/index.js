require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectWithDB = require("./config/db");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

// Connect with database
connectWithDB();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// *** Initialize Express app instance HERE ***
const app = express();

// For handling cookies
app.use(cookieParser());

// Initialize cookie-session middleware
app.use(
  cookieSession({
    name: "session",
    maxAge: process.env.COOKIE_TIME * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
    // secure: true, // Only send over HTTPS (RECOMMENDED for production)
    // sameSite: "none", // Allow cross-origin requests (RECOMMENDED for production)
    // httpOnly: true, // Makes the cookie accessible only on the server-side (RECOMMENDED)
  })
);

// Middleware to handle JSON requests
app.use(express.json());

// --- START OF CORRECTED CORS CONFIGURATION ---
// Define allowed origins explicitly, including your main Vercel domain
const allowedOrigins = [
  process.env.CLIENT_URL, // This should be "https://chilspace.vercel.app" from Render env var
  'http://localhost:5173', // For your local Vite frontend development
  'http://127.0.0.1:5173'  // Sometimes used for local development
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow if the origin is in our explicitly allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      }
      // OR, allow any Vercel domain that ends with .vercel.app (covers all preview deployments and main aliases)
      else if (origin && origin.endsWith('.vercel.app')) {
        callback(null, true);
      }
      // OR, allow requests with no origin (e.g., Postman, curl) - use with caution in production
      else if (!origin) {
        callback(null, true);
      }
      // Block all other origins
      else {
        console.error("CORS blocked origin:", origin); // Log blocked origins for debugging
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  })
);
// --- END OF CORRECTED CORS CONFIGURATION ---

// Use express router
app.use("/", require("./routes"));

// Start the server
app.listen(process.env.PORT || 8000, (err) => {
  if (err) {
    console.log("Error in connecting to server: ", err);
  }
  console.log(`Server is running on port no. ${process.env.PORT || 8000}`);
});

module.exports = app;