const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "*",
  })
);

const parts = require("./routes/parts");
const users = require("./routes/users");
const vehicles = require("./routes/vehicles");
const carts = require("./routes/carts");
const orders = require("./routes/orders");
const auth = require("./routes/auth");

const config = require("config");
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/automobileMarketplace")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect", err));

app.use(express.json());
app.get("/", () => {
  console.log("Hello world");
});
app.use("/api/parts", parts);
app.use("/api/users", users);
app.use("/api/vehicles", vehicles);
app.use("/api/carts", carts);
app.use("/api/orders", orders);
app.use("/api/auth", auth);

const port = process.env.PORT || 3001;
app.listen(port);
