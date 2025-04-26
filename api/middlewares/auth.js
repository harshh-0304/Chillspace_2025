const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Base authentication middleware - checks if user is logged in
exports.isLoggedIn = async (req, res, next) => {
  // Token could be found in request cookies or in request headers
  const token =
    req.cookies.token ||
    (req.header("Authorization")
      ? req.header("Authorization").replace("Bearer ", "")
      : "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login first to access this page",
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB and attach to the request object
    req.user = await User.findById(decoded.id);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle JWT verification error
    console.error("JWT verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Role-based middleware functions

// Admin role check
exports.isAdmin = async (req, res, next) => {
  // Check if user exists and has admin role
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Admins only",
    });
  }
  next();
};

// Host role check
exports.isHost = async (req, res, next) => {
  // Check if user exists and has host role
  if (!req.user || req.user.role !== "host") {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Hosts only",
    });
  }
  next();
};

// Guest role check
exports.isGuest = async (req, res, next) => {
  // Check if user exists and has guest role
  if (!req.user || req.user.role !== "guest") {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Guests only",
    });
  }
  next();
};

// Combined middleware for multiple roles
exports.hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access Denied: Restricted to ${roles.join(", ")}`,
      });
    }
    next();
  };
};
