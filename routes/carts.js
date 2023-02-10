const { Cart, validate } = require("../models/cart");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const carts = await Cart.find({ user: req.user._id });
  res.send(carts);
});

router.get("/:id", auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id, part: req.params.id });
  if (!cart) return res.status(404).send("Cart not found.");
  res.send(cart);
});

router.post("/", auth, async (req, res) => {
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);
  body.user = req.user._id;
  try {
    const cart = new Cart(_.pick(body, ["user", "part", "quantity"]));
    await cart.save();
    res.send(cart);
  } catch (ex) {
    res.status(400).send("Duplicate");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);
  body.user = req.user._id;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id, part: req.params.id },
    _.pick(body, ["quantity"]),
    { new: true }
  );
  if (!cart) return res.status(404).send("Cart not found");
  res.send(cart);
});

router.delete("/:id", auth, async (req, res) => {
  const cart = await Cart.findOneAndDelete({
    user: req.user._id,
    part: req.params.id,
  });
  if (!cart) return res.status(404).send("Cart not found");
  res.send(cart);
});

module.exports = router;
