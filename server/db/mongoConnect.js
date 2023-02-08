const {config} = require("../config/secret")
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.mykqfum.mongodb.net/yarinMyapp`);
  console.log("mongo connect yarinMyApp");
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}