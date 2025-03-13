let mongoUrl;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  mongoUrl = "mongodb://127.0.0.1:27017/airbnb";
} else {
  mongoUrl = process.env.DB_URL;
}

const mongoose = require("mongoose");
const Listing = require("../models/listing.model.js");
let data = require("./data.js");
const MongoStore = require("connect-mongo");

main()
  .then(() => console.log("Connection succesfull"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoUrl);
}

const store = MongoStore.create({
  mongoUrl: mongoUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const initDb = async () => {
  let listing = await Listing.deleteMany({});
  let geometry = { type: "Point", coordinates: [77.1025, 28.7041] };
  data = data.map((obj) => {
    return { ...obj, owner: "67d292fffb605a80906261cc", geometry };
  });
  console.log(data);
  let lists = await Listing.insertMany(data);
  console.log(lists);
};

initDb();
