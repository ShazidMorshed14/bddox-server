const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ObjectId } = mongoose.Schema.Types;

const prescriptionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: ObjectId,
      ref: "User",
      require: true,
      unique: true,
    },
    doctor_uid: {
      type: String,
      require: true,
    },
    topLeft: {
      type: String,
    },
    topRight: {
      type: String,
    },
    bottomLeft: {
      type: String,
    },
    bottomRight: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
