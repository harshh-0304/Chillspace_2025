// const mongoose = require("mongoose");
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')


// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   picture: {
//     type: String,
//     required: true,
//     default: 'https://res.cloudinary.com/rahul4019/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1695133265/pngwing.com_zi4cre.png'
//   }
// });

// // encrypt password before saving it into the DB
// userSchema.pre("save", async function (next) {
//   this.password = await bcrypt.hash(this.password, 10)
// })

// // create and return jwt token
// userSchema.methods.getJwtToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRY,
//   })
// }

// // validate the password
// userSchema.methods.isValidatedPassword = async function (userSentPassword) {
//   return await bcrypt.compare(userSentPassword, this.password)
// }


// const User = mongoose.model("User", userSchema);

// module.exports = User;

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator'); // For email validation (install via `npm install validator`)

const userSchema = new mongoose.Schema({
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
        return validator.isEmail(value); // Uses 'validator' library
        // Alternative (regex): return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      },
      message: "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    },
    role: {
      type: String,
      enum: ['guest', 'host', 'admin'],
      default: 'guest'
    }
  },
  picture: {
    type: String,
    required: true,
    default: 'https://res.cloudinary.com/rahul4019/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1695133265/pngwing.com_zi4cre.png'
  }
  ,
  
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password isn't modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT Token generation
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// Validate password
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
  return await bcrypt.compare(userSentPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;