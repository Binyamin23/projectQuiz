const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  name: String,
  info: String,
  price: Number,
  img_url: String,
  link_url: String,
  category_url: String,
  user_id: String,
  date: {
    type: Date, default: Date.now
  },
  short_id:Number
})
exports.GamesAppsModel = mongoose.model("gamesapps", schema)

exports.validateJoi = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(1).max(150).required(),
    info: Joi.string().min(1).max(999).required(),
    price: Joi.number().min(1).max(9999).required(),
    img_url: Joi.string().min(1).max(500).allow(null,""),
    link_url: Joi.string().min(1).max(400).required(),
    category_url: Joi.string().min(1).max(150).required()
  })
  return joiSchema.validate(_reqBody)
}