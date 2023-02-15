const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  name: String,
  company_id: Number,
  info: String,
  price: Number,
  sizes: String,
  imgUrl: String,
})
exports.ShoeModel = mongoose.model("shoes", schema)

exports.validateJoi = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(1).max(999).required(),
    company_id: Joi.number().min(1).max(999).required(),
    info: Joi.string().min(1).max(999).required(),
    price: Joi.number().min(1).max(999).required(),
    sizes: Joi.string().min(1).max(999).required(),
    imgUrl: Joi.string().min(1).max(999).allow(null, ""),
  })
  return joiSchema.validate(_reqBody)
}