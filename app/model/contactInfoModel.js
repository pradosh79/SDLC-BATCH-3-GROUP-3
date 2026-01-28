const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    mapEmbedUrl: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactInfo", contactInfoSchema);
