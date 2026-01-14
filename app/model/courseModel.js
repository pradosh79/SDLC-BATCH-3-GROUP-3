const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const courseSchema = new mongoose.Schema({

  title: { type: String, required: true, trim: true },

  shortDescription: { type: String, required: true },

  longDescription: { type: String },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  thumbnail: { type: String, required: true },

  category: { type: String, default: "General" },

  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },

  totalLessons: { type: Number, default: 0 },

  totalDuration: { type: String },

  price: { type: Number, default: 0 },

  avgRating: { type: Number, default: 0 },

  totalRatings: { type: Number, default: 0 },

  isPublished: { type: Boolean, default: true },

  tags: [String],

}, { timestamps: true });

courseSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Course", courseSchema);
