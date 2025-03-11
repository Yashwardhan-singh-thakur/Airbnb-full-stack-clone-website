const mongoose = require("mongoose");
const { Schema } = mongoose;
// Using Passport for athentication passport-local-mongoose
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("User", userSchema);
