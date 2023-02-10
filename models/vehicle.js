const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Vehicle = mongoose.model(
  "Vehicle",
  new mongoose.Schema({
    brand: { type: String, required: true, minlength: 5, maxlength: 20 },
    model: { type: String, required: true, minlength: 5, maxlength: 20 },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: true,
      minlength: 10000,
      maxlength: 99999999,
    },
    milage: { type: Number, required: true, min: 0, max: 999999 },
    color: { type: String, required: true, minlength: 5, maxlength: 20 },
    year: { type: Number, required: true, min: 1990, max: 2023 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: { type: String, required: true, minlength: 4, maxlength: 40 },
    status: { type: String, enum: ["Sold", "Available"] },
    imageSrc: [{ type: String, required: true }],
  })
);

validate = (req) => {
  const schema = Joi.object({
    brand: Joi.string().min(5).max(20).required(),
    model: Joi.string().min(5).max(20).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().min(10000).max(99999999).required(),
    milage: Joi.number().min(0).max(999999).required(),
    color: Joi.string().min(5).max(50).required(),
    year: Joi.number().min(1990).max(2023).required(),
    location: Joi.string().min(4).max(40).required(),
    user: Joi.objectId().required(),
    status: Joi.string().valid("Sold", "Available"),
    imageSrc: Joi.array().required(),
  });
  return schema.validate(req);
};

exports.Vehicle = Vehicle;
exports.validate = validate;
