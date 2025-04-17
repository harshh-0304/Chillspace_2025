const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Checks if the user is logged in (without checking for admin role)
exports.isLoggedIn = async (req, res, next) => {
    // Token could be found in request cookies or in request headers
    const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Login first to access this page',
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
        console.error('JWT verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};

// Optional: Admin role check (for admin routes only)
exports.isAdmin = async (req, res, next) => {
    // If the user role is not 'admin', deny access
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access Denied: Admins only',
        });
    }
    next();  // Allow access for admins
};
