const mongoose = require("mongoose");
const Joi = require("joi");

const Part = mongoose.model(
  "Part",
  new mongoose.Schema({
    model: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    description: { type: String, required: true, minlength: 5, maxlength: 255 },
    price: { type: Number, required: true, min: 1000, max: 99999 },
    stock: { type: Number, required: true, min: 0, max: 10000 },
    imageSrc: [{ type: String, required: true }],
  })
);

validate = (req) => {
  const schema = Joi.object({
    model: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(5).max(255).required(),
    imageSrc: Joi.array().required(),
    price: Joi.number().min(0).max(99999).required(),
    stock: Joi.number().min(0).max(10000).required(),
  });
  return schema.validate(req);
};

exports.Part = Part;
exports.validate = validate;
