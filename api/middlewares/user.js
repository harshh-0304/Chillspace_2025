// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Checks user is logged in based on passed token and set the user in request
// exports.isLoggedIn = async (req, res, next) => {
//     // token could be found in request cookies or in reqest headers
//     const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: 'Login first to access this page',
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);
//         next();
//     } catch (error) {
//         // Handle JWT verification error
//         console.error('JWT verification error:', error);
//         return res.status(401).json({
//             success: false,
//             message: 'Invalid token',
//         });
//     }
// };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Checks user is logged in and is an admin
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        // Check if the user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: Admins only',
            });
        }

        next();  // Allow access if user is an admin
    } catch (error) {
        // Handle JWT verification error
        console.error('JWT verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};
