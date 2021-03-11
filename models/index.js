const mongoose = require("mongoose");
const Restaurant = require("./restaurant");
const RestaurantScore = require("./restaurantScore");

let connectionString = "";
require("dotenv").config();

if (process.env.NODE_ENV === "development") {
  connectionString = "mongodb://127.0.0.1:27017/gzhu-pi-mongodb";
} else {
  connectionString = `${process.env.MONGODB_CONNECT_STRING}/gzhu-pi`;
}

const connectDB = () => {
  // console.log(`connecting to ${connectionString} DB...`);
  console.log(`connecting to ${connectionString} ...`);
  return mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // ? why
    useFindAndModify: false,
  });
};

const modules = { Restaurant, RestaurantScore };
module.exports = {
  connectDB,
  modules,
};
