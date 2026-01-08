const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
    },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
   },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  review: String
}, { timestamps: true });

module.exports = mongoose.model("Rating", ratingSchema);
