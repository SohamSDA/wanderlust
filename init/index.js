const mongoose = require("mongoose");
let sampleListings = require("./data.js"); // Ensure `data.js` exports sampleListings correctly
const Listing = require("../models/listing.js");

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
      
    console.log("Connection established to DB");

    await init();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    mongoose.connection.close();
  }
}

async function init() {
  try {
    await Listing.deleteMany({});
    console.log("Old data removed");
    sampleListings = sampleListings.map((obj) => ({...obj, owner: '685033ee91916b05e55f4b54'}));
    await Listing.insertMany(sampleListings);
    console.log("Sample data added successfully");
  } catch (error) {
    console.error("Error initializing database with sample data:", error);
  }
} 

main();
