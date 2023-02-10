const { Part, validate } = require("../models/part");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const search = { $regex: "(?i)" + req.query.search + "(?-i)" };
  const parts = await Part.find({ model: search }).sort("model");
  res.send(parts);
});

router.get("/:id", async (req, res) => {
  const part = await Part.findById(req.params.id);
  if (!part) return res.status(404).send("Part not found.");
  res.send(part);
});

router.post("/", [auth, admin], async (req, res) => {
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);
  const part = new Part(
    _.pick(body, ["model", "description", "price", "stock", "imageSrc"])
  );
  await part.save();
  res.send(part);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);
  const part = await Part.findByIdAndUpdate(
    req.params.id,
    _.pick(body, ["model", "description", "price", "stock", "imageSrc"]),
    { new: true }
  );
  if (!part) return res.status(404).send("Part not found");
  res.send(part);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const part = await Part.findByIdAndDelete(req.params.id);
  if (!part) return res.status(404).send("Part not found");
  res.send(part);
});

module.exports = router;
