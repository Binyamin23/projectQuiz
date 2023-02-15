const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  name: String,
  info: String,
  url_code: String,
  img_url: String
})
exports.CategoryModel = mongoose.model("categories", schema)


exports.validateJoi = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    url_code: Joi.string().min(1).max(100).required(),
    img_url: Joi.string().min(1).max(500).allow(null,""),
    info: Joi.string().min(1).max(999).required(),
  })
  return joiSchema.validate(_reqBody)
}