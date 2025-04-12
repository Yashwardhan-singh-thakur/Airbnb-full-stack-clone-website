const mongoose = require("mongoose");
const { Schema } = mongoose;
// Using Passport for athentication passport-local-mongoose
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
  },
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = new mongoose.model("User", userSchema);
