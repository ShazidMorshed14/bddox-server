const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const fromatSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Format", fromatSchema);
