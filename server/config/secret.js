const dotenv = require("dotenv");
dotenv.config();

exports.config = {
  userDb: process.env.USER_DB,
  passDb: process.env.PASS_DB,
  tokenSecret: process.env.TOKEN_SECRET,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
}
