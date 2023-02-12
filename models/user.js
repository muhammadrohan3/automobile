const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const passwordComplexity = require("joi-password-complexity");
const complexityOptions = {
  min: 8,
  max: 255,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 5, maxlength: 255 },
  lastName: { type: String, required: true, minlength: 5, maxlength: 255 },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: { type: String, required: true, minlength: 8, maxlength: 1024 },
  street: { type: String, required: true, minlength: 5, maxlength: 255 },
  city: { type: String, required: true, minlength: 5, maxlength: 255 },
  zip: { type: String, required: true, minlength: 4, maxlength: 9 },
  imageSrc: { type: String },
  isAdmin: { type: Boolean },
  phone: { type: String, required: true, minlength: 5, maxlength: 14 },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

validate = (req) => {
  const schema = Joi.object({
    firstName: Joi.string().min(5).max(255).required(),
    lastName: Joi.string().min(5).max(255).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: passwordComplexity(complexityOptions),
    street: Joi.string().min(2).max(255).required(),
    city: Joi.string().min(2).max(255).required(),
    zip: Joi.string().min(4).max(9).required(),
    imageSrc: Joi.string(),
    phone: Joi.string().required().min(5).max(14),
  });
  return schema.validate(req);
};

exports.User = User;
exports.validate = validate;
