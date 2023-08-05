const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ObjectId } = mongoose.Schema.Types;

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    pid: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    dob: {
      type: String,
      require: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    ref: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
