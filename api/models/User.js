const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt"); // Make sure this is imported correctly
const jwt = require("jsonwebtoken"); // Make sure this is imported correctly
const { isEmail } = require("validator");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
    validate: {
      validator: function (value) {
        return isEmail(value); // Uses 'validator' library
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false, // Prevents password from being returned in queries
    validate: {
      validator: function (value) {
        // At least 1 uppercase, 1 lowercase, 1 number, 1 special char
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        );
      },
      message:
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    },
  },
  role: {
    type: String,
    enum: ["guest", "host", "admin"],
    default: "guest", // By default, users are registered as guests
    required: true,
  },
  picture: {
    type: String,
    required: true,
    default:
      "https://res.cloudinary.com/rahul4019/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1695133265/pngwing.com_zi4cre.png",
  },
  // Additional fields for host role
  hostInfo: {
    type: {
      verified: {
        type: Boolean,
        default: false,
      },
      properties: [
        {
          type: Schema.Types.ObjectId,
          ref: "Property",
        },
      ],
      joinedDate: {
        type: Date,
        default: Date.now,
      },
    },
    default: {},
  },
  // Fields for guests
  guestInfo: {
    type: {
      bookings: [
        {
          type: Schema.Types.ObjectId,
          ref: "Booking",
        },
      ],
      reviews: [
        {
          type: Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
    },
    default: {},
  },
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password isn't modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT Token generation
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// Validate password
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
  return await bcrypt.compare(userSentPassword, this.password);
};

const User = model("User", userSchema);
module.exports = User;
