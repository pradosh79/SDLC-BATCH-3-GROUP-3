const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      trim: true
    },

    message: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },

    image: {
      type: String, // Cloudinary URL
      required: true
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

module.exports = mongoose.model("Testimonial", testimonialSchema);
