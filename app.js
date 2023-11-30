const express = require("express");
const mongoose = require("mongoose");
const router = require("./src/routes/indexRoute");
// const cors = require('./')

const app = express();
const morgan = require("morgan");

require("dotenv").config();

app.use(morgan("dev"));

// Form type
// middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));
// Middleware to parse JSON data
app.use(express.json());

// setup Cross-origin Resource Sharing
// to enable passing requests through the frontend
app.use(require("cors")());

// Route link
// app.use('/api/auth', router)
app.use("/da", router);

// app.use(errorHandler)

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("There is an issue trying to connect to your database");
  });

const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
