const mongoose = require("mongoose");
const Joi = require("joi");

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    part: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      minlength: 0,
      maxlength: 20,
    },
  })
);

validate = (req) => {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    part: Joi.objectId().required(),
    quantity: Joi.number().min(0).max(20).required(),
  });
  return schema.validate(req);
};

exports.Cart = Cart;
exports.validate = validate;
