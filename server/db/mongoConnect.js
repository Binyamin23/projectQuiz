const { config } = require("../config/secret");
const mongoose = require('mongoose');

// Set the 'strictQuery' option
mongoose.set('strictQuery', false);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.mykqfum.mongodb.net/quizApp`);
  console.log("mongo connected to quizApp");
}
