const mongoose = require("mongoose");

const trustedBySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true
    },

    logo: {
      type: String, // Cloudinary URL
      required: true
    },

    website: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    },

    position: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrustedBy", trustedBySchema);
