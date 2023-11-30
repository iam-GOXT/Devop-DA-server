const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./src/routes/indexRoute");

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
app.use(
  cors({
    preflightContinue: true,
    origin: [
      "http://localhost:5500",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://da-ten-olive.vercel.app",
      "https://da-*.vercel.app",
      "https://da-admin-portal-client.vercel.app",
      "https://da-admin-portal-client-*.vercel.app",
      "https://da-admin-portal-five.vercel.app",
      "https://da-admin-portal-*.vercel.app",
      "https://admin.tuitionfreecourses.com",
      "https://tuitionfreecourses.com",
    ],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    headers: "Content-Type, Authorization, X-Requested-With",
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Content-Type",
      "Authorization",
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the DA Admin Server");
});

// Route link
app.use("/da", router);

// app.use(errorHandler)

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
