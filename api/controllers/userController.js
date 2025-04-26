const User = require("../models/User");
const cookieToken = require("../utils/cookieToken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // This fetches all users from the database

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Register/SignUp user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "guest" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Validate role - only allow guest or host during registration
    // Admin roles are managed separately for security
    if (role !== "guest" && role !== "host") {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified. Allowed roles are: guest, host",
      });
    }

    // Check if user is already registered
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered!",
      });
    }

    // Create user with specified role
    user = await User.create({
      name,
      email,
      password,
      role,
    });

    // After creating new user in DB send the token
    cookieToken(user, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      error: err.message,
    });
  }
};

// Login/SignIn user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for presence of email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required!",
      });
    }

    // Get user from DB with password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!",
      });
    }

    // Match the password
    const isPasswordCorrect = await user.isValidatedPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect!",
      });
    }

    // If everything is fine we will send the token
    cookieToken(user, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      error: err.message,
    });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { name, email, role = "guest" } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Validate role - only allow guest or host during registration
    if (role !== "guest" && role !== "host") {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified. Allowed roles are: guest, host",
      });
    }

    // Check if user already registered
    let user = await User.findOne({ email });

    // If the user does not exist, create a new user in the DB
    if (!user) {
      user = await User.create({
        name,
        email,
        role,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });
    }

    // Send the token
    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      error: err.message,
    });
  }
};

// Upload profile picture
exports.uploadPicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const { path } = req.file;
  try {
    let result = await cloudinary.uploader.upload(path, {
      folder: "Airbnb/Users",
    });

    res.status(200).json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update user details
exports.updateUserDetails = async (req, res) => {
  try {
    const { name, password, email, picture } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Allow updating name, password, and picture
    if (name) user.name = name;
    if (picture) user.picture = picture;
    if (password) user.password = password; // This will trigger the pre-save hook for hashing

    const updatedUser = await user.save();
    cookieToken(updatedUser, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: "User ID and role are required",
      });
    }

    if (!["guest", "host", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed roles: guest, host, admin",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//* DELETE USER
// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true, // Only send over HTTPS
    sameSite: "none", // Allow cross-origin requests
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//*ADMIN
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    if (!name || !email || !password || !adminCode) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and admin code are required",
      });
    }

    // Verify the admin registration code (store this securely in environment variables)
    if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin registration code",
      });
    }

    // Check if user is already registered
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered!",
      });
    }

    // Create user with admin role
    user = await User.create({
      name,
      email,
      password,
      role: "admin", // Set role to admin
    });

    // After creating new admin user in DB send the token
    cookieToken(user, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      error: err.message,
    });
  }
};

// Alternative: Allow admin creation by existing admins
exports.createAdmin = async (req, res) => {
  try {
    // First check if the requester is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only admins can create other admin accounts",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check if user is already registered
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered!",
      });
    }

    // Create user with admin role
    user = await User.create({
      name,
      email,
      password,
      role: "admin", // Set role to admin
    });

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      error: err.message,
    });
  }
};
