const { Vehicle, validate } = require("../models/vehicle");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const search = { $regex: "(?i)" + req.query.search + "(?-i)" };
  const vehicles = await Vehicle.find({ model: search }).sort("model");
  res.send(vehicles);
});

router.get("/:id", async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate(
    "user",
    "phone firstName lastName"
  );
  if (!vehicle) return res.status(404).send("Vehicle not found.");
  res.send(vehicle);
});

router.post("/", auth, async (req, res) => {
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);
  body.user = req.user._id;
  const vehicle = new Vehicle(
    _.pick(body, [
      "brand",
      "model",
      "description",
      "price",
      "milage",
      "color",
      "year",
      "user",
      "location",
      "status",
      "imageSrc",
    ])
  );
  await vehicle.save();
  res.send(vehicle);
});

router.put("/:id", auth, async (req, res) => {
  const { body } = req;
  let vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).send("Vehicle not found");

  if (req.user._id !== vehicle.user.valueOf())
    return res.status(403).send("Access denied");

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);
  vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    _.pick(body, [
      "brand",
      "model",
      "description",
      "price",
      "milage",
      "color",
      "year",
      "user",
      "location",
      "status",
      "imageSrc",
    ]),
    { new: true }
  );
  if (!vehicle) return res.status(404).send("Vehicle not found");
  res.send(vehicle);
});

router.delete("/:id", auth, async (req, res) => {
  let vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).send("Vehicle not found");

  if (req.user._id !== vehicle.user.valueOf())
    return res.status(403).send("Access denied");

  vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) return res.status(404).send("Vehicle not found");
  res.send(vehicle);
});

module.exports = router;
