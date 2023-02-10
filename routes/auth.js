const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/", async (req, res) => {
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

validate = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(50).required(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(body);
};

module.exports = router;
