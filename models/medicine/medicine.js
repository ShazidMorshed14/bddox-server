const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const medicineSchema = new mongoose.Schema(
  {
    doctorId: {
      type: ObjectId,
      ref: "User",
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    sku: {
      type: String,
      require: true,
    },
    formatId: {
      type: ObjectId,
      ref: "Format",
      require: true,
    },
    genericId: {
      type: ObjectId,
      ref: "Generic",
      require: true,
    },
    companyId: {
      type: ObjectId,
      ref: "Company",
      require: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
