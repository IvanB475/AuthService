const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv").config();

const openApiRoutes = require("./routes/openApi");
const closedApiRoutes = require("./routes/closedApi");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");
app.use(helmet());

mongoose.connect("mongodb://localhost:27017/QuickreadAuthService", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected to DB");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(openApiRoutes);
app.use(closedApiRoutes);

app.get("/*", async (req, res, next) => {
  res.status(404).json({ message: "Nothing to see here" });
});

app.listen(PORT, () => {
  console.log("Server started successfully on port " + PORT);
});
