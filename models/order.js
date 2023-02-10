const mongoose = require("mongoose");
const Joi = require("joi");
// const Fawn = require("fawn");
// Fawn.init(mongoose);

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parts: [
      [
        {
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
        },
      ],
    ],
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  })
);

validate = (req) => {
  const schema = Joi.object({
    status: Joi.string().valid("Pending", "Completed"),
  });
  return schema.validate(req);
};

exports.Order = Order;
exports.validate = validate;
