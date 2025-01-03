const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data = initData.data.map((owner) => {
    return { ...owner, owner: "6774f79baf052e0216b6ec86" };
  });
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
