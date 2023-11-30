const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    fee: {
      type: String,
    },
    beginning: {
      type: String,
      trim: true,
      default: "summer semester",
    },
    city: {
      type: String,
      trim: true,
      default: "null",
    },
    faculty: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    contact: {
      type: String,
      required: true,
      // max: 11,
    },
    courseOverview: {
      type: String,
      trim: true,
    },
    aboutSchool: {
      type: String,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
      default: "null",
    },
    funding: {
      type: String,
      trim: true,
    },
    requirement: {
      type: String,
      trim: true,
    },
    services: {
      type: String,
      trim: true,
    },
    isDraft: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Draft", "Trash"],
      default: "Active",
    },
    image: {
      type: String,
    },
    logo: {
      type: String,
    },
    type: String,
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const recordModel = mongoose.model("Record", recordSchema);
module.exports = recordModel;
