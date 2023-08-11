const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const appointmentSchema = new mongoose.Schema(
  {
    aid: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    doctorId: {
      type: ObjectId,
      ref: "User",
      require: true,
    },
    patientId: {
      type: ObjectId,
      ref: "Patient",
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    time: {
      type: String,
      require: true,
    },
    next_visiting_date: {
      type: String,
    },
    payment: {
      type: Number,
      default: 0,
    },
    payment_status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    tests: {
      type: Array,
    },
    test_ref: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "postponded", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
