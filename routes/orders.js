const { Order, validate } = require("../models/order");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const auth = require("../middleware/auth");
const { Cart } = require("../models/cart");
const { Part } = require("../models/part");
const admin = require("../middleware/admin");
// const mongoose = require("mongoose");
// const Fawn = require("fawn");
// Fawn.init(mongoose);

router.get("/", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

router.post("/", auth, async (req, res) => {
  const { body } = req;
  body.user = req.user._id;
  body.parts = await Cart.find({ user: body.user }).select(
    "part quantity -_id"
  );
  if (!body.parts) return res.status(404).send("Nothing in cart");
  try {
    const order = new Order(_.pick(body, ["user", "parts"]));
    await order.save();
    let i = 0;
    while (i < body.parts.length) {
      await Part.findByIdAndUpdate(
        body.parts[i].part,
        { $inc: { stock: -body.parts[i].quantity } },
        { new: true }
      );
      i++;
    }
    await Cart.deleteMany({ user: body.user });
    res.send(order);
  } catch (ex) {
    res.status(400).send(ex);
  }
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    _.pick(body, ["status"]),
    { new: true }
  );
  if (!order) return res.status(404).send("order not found");
  res.send(order);
});

module.exports = router;
