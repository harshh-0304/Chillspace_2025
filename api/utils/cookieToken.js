const cookieToken = (user, res) => {
  // Get JWT token
  const token = user.getJwtToken();

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  // Create a sanitized user object without sensitive information
  const sanitizedUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    picture: user.picture,
  };

  // Return response with cookie and JSON containing token and user info
  return res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user: sanitizedUser,
  });
};

module.exports = cookieToken;
