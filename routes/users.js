const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find().sort("firstName");
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(
    _.pick(body, [
      "firstName",
      "lastName",
      "email",
      "password",
      "street",
      "city",
      "zip",
      "imageSrc",
      "phone",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(
      _.pick(user, [
        "firstName",
        "lastName",
        "email",
        "password",
        "street",
        "city",
        "zip",
        "imageSrc",
      ])
    );
});

router.put("/", auth, async (req, res) => {
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: body.email });
  const validPassword = await bcrypt.compare(body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  user = await User.findByIdAndUpdate(
    req.user._id,
    _.pick(body, [
      "firstName",
      "lastName",
      "email",
      "password",
      "street",
      "city",
      "zip",
      "imageSrc",
    ]),
    { new: true }
  );
  if (!user) return res.status(404).send("user not found");
  res.send(
    _.pick(user, [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "zip",
      "imageSrc",
    ])
  );
});

router.delete("/", auth, async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

module.exports = router;
