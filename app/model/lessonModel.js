const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const lessonSchema = new mongoose.Schema({

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  videoUrl: { 
    type: String, 
    required: true 
  },

  duration: {
    type: String 
  },

  order: {
    type: Number,
    default: 1
  }

}, { timestamps: true });


module.exports = mongoose.model("Lesson", lessonSchema);
lessonSchema.plugin(aggregatePaginate);
const LessonSchema = mongoose.model('lesson',lessonSchema);
module.exports = LessonSchema;