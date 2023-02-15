const mongoose = require("mongoose");
const Joi = require("joi");
// ספרייה שמייצרת ובודקת טוקנים
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  // שניצור רשומה ייצר לו אוטומטית מאפיין תאריך
  // של עכשיו לפי השרת
  date_created:{
    type:Date, default:Date.now()
  },
  //תפקיד משתמש , אם משתמש רגיל או אדמין
  role:{
    type:String, default:"user"
  },
  img_url:String
})

exports.UserModel = mongoose.model("users",userSchema);

// מייצר טוקן ומגביל אותו ל 60 דוקת
// role - תפקיד הרשאות של משתמש במקרה שלנו יכול להיות
// user or admin
exports.createToken = (_id,role) => {
  let token = jwt.sign({_id,role},config.tokenSecret,{expiresIn:"600mins"});
  return token;
}

exports.validteUser = (reqBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(150).required(),
    email:Joi.string().min(2).max(150).email().required(),
    password:Joi.string().min(3).max(150).required()
  })
  return joiSchema.validate(reqBody);
}

// וולדזציה ללוג אין - שצריך רק מייל וסיסמא
exports.validteLogin = (reqBody) => {
  let joiSchema = Joi.object({
    email:Joi.string().min(2).max(150).email().required(),
    password:Joi.string().min(3).max(150).required()
  })
  return joiSchema.validate(reqBody);
}