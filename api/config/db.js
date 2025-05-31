// const mongoose = require("mongoose");

// const connectWithDB = () => {
//   mongoose.set("strictQuery", false);
//   mongoose
//     .connect(process.env.DB_URL, {
//       // useNewUrlParser: true,
//       // useUnifiedTopology: true,
//     })
//     .then(console.log(`DB connected successfully`))
//     .catch((err) => {
//       console.log(`DB connection failed`);
//       console.log(err);
//       process.exit(1);
//     });
// };

// module.exports = connectWithDB;
const mongoose = require("mongoose");

const connectWithDB = () => {
  mongoose.set("strictQuery", false); // Recommended for Mongoose 6+
  mongoose
    .connect(process.env.DB_URL, {
      // useNewUrlParser: true,    // These options are true by default in Mongoose 6+
      // useUnifiedTopology: true, // and can usually be omitted.
    })
    .then(() => console.log(`DB connected successfully`)) // Corrected console.log syntax
    .catch((err) => {
      console.log(`DB connection failed`);
      console.log(err);
      process.exit(1); // Exit process if connection fails
    });
};

module.exports = connectWithDB;