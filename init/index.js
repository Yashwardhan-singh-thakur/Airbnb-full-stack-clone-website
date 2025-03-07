if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let data = require("./data.js");
const MongoStore = require("connect-mongo");

main()
  .then(() => console.log("Connection succesfull"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const initDb = async () => {
  let listing = await Listing.deleteMany({});
  let geometry = { type: "Point", coordinates: [77.1025, 28.7041] };
  data = data.map((obj) => {
    return { ...obj, owner: "678e193850341e4c48fdf362", geometry };
  });
  console.log(data);
  let lists = await Listing.insertMany(data);
  console.log(lists);
};

initDb();
