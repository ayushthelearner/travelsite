

const initdata = require("./data.js");
const listing = require("../models/listing.js");

const mongoose = require('mongoose');

main().then(()=>{
    console.log("connected to db");
}).catch(err=> console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initdb = async()=>{
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initdb();
