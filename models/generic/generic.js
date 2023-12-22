const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const genericSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Generic", genericSchema);
