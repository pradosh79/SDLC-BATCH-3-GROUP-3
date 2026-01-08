const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const courseSchema = new mongoose.Schema({

  // TITLE & DESCRIPTION
  title: {
    type: String,
    required: true,
    trim: true
  },

  shortDescription: {
    type: String,
    required: true,
  },

  longDescription: {
    type: String
  },

  // WHO CREATED IT?
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // THUMBNAIL IMAGE (Cloudinary)
  thumbnail: { 
    type: String, 
    required: true 
  },

  // CATEGORY (UI has categories)
  category: {
    type: String,
    default: "General"
  },

  // COURSE LEVEL (e.g., Beginner, Intermediate, Advanced)
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },

  // TOTAL VIDEO COUNT
  totalLessons: {
    type: Number,
    default: 0
  },

  // TOTAL DURATION
  totalDuration: {
    type: String
  },

  // PRICE / FREE
  price: {
    type: Number,
    default: 0
  },

  // RATINGS (UI shows stars)
  avgRating: {
    type: Number,
    default: 0
  },

  totalRatings: {
    type: Number,
    default: 0
  },

  // PUBLISHED STATUS
  isPublished: {
    type: Boolean,
    default: false
  },

  // FOR SEARCH / FILTER
  tags: [String],

avgRating: { 
  type: Number, 
  default: 0 
},
totalRatings: { 
  type: Number, 
  default: 0 
},

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
courseSchema.plugin(aggregatePaginate);
const CourseModel = mongoose.model('course',courseSchema);
module.exports = CourseModel;