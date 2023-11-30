const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: [true, "A user must have an email"],
    },
    firstName: {
      type: String,
      required: [true, "A user must have a first name"],
    },
    lastName: {
      type: String,
      required: [true, "A user must have a last name"],
    },
    userName: {
      type: String,
      required: [true, "A user must have a username"],
    },
    password: {
      type: String,
      required: true,
    },
    passcode: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "superAdmin"],
      default: "admin",
      required: true,
    },
    admin_access: {
      type: String,
      enum: ["Level 1 Access", "Level 2 Access"],
      default: "Level 1 Access",
    },
    profile_img: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Encrypt password before pushing to database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  if (!password) throw new Error("Password is missing, cannot compare");

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (e) {
    console.log("Error while comparing password", e.message);
  }
};

userSchema.methods.toJSON = function () {
  const userData = this.toObject();

  delete userData.password;
  delete userData.deleted;
  return userData;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
