const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  question: String,
  level: Number,
  cat_url: String,
  img_url: String,
  info: String,
  answers: [String],
  status: { type: Boolean, default: false },
  date: {
    type: Date,
    default: Date.now
  },
  short_id: Number,
  random: { type: Number, default: Math.random }
});

exports.QuestionsModel = mongoose.model("questions", schema);

exports.validateJoi = (_reqBody) => {
  let joiSchema = Joi.object({
    question: Joi.string().min(1).max(200).required(),
    level: Joi.number().min(1).max(3).required(),
    cat_url: Joi.string().min(1).max(20).required(),
    img_url: Joi.string().min(1).max(200).allow("", null),
    info: Joi.string().min(10).max(500).allow("",null),
    answers: Joi.array().items(Joi.string()).length(4).required()
  })
  return joiSchema.validate(_reqBody)
}