const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const tagSchema = new mongoose.Schema(
  {
    doctorId: {
      type: ObjectId,
      ref: "User",
      require: true,
    },
    value: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      //enum: ["pending", "postponded", "cancelled", "completed"],
      default: "cc",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);
