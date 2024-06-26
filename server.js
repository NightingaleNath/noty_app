require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const noteRouter = require("./routes/note");

const app = express();

app.use(express.json());
app.use("/api", userRouter);
app.use("/api", noteRouter);

const port = process.env.PORT || 3000;
const mongoDBUrl = process.env.MONGODB_URL;

mongoose
  .connect(mongoDBUrl)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
