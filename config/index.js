const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const config = {
  mongoUrl:
    process.env.NODE_ENV !== "production"
      ? "mongodb://127.0.0.1:27017/airbnb"
      : process.env.DB_URL,

  googleCallbackUrl:
    process.env.NODE_ENV !== "production"
      ? "/auth/google/callback"
      : "https://wanderlust-6nid.onrender.com/auth/google/callback",
};

module.exports = config;
