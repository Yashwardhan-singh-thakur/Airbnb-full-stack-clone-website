const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let data = require("./data.js");

main()
  .then(() => console.log("Connection succesfull"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initDb = async () => {
  let listing = await Listing.deleteMany({});
  let geometry = { type: "Point", coordinates: [77.1025, 28.7041] };
  data = data.map((obj) => {
    return { ...obj, owner: "674edf125f39daa81a6d2926", geometry };
  });
  console.log(data);
  let lists = await Listing.insertMany(data);
  console.log(lists);
};

initDb();
