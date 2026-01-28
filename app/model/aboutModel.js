const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  welcomeTitle: { type: String, required: true },
  welcomeDescription: { type: String, required: true },

  visionTitle: String,
  visionDescription: String,

  trustedBy: [String], // logo URLs

  testimonials: [
    {
      name: String,
      role: String,
      review: String,
      rating: Number
    }
  ]
}, { timestamps: true });


module.exports = mongoose.model("About", aboutSchema);
