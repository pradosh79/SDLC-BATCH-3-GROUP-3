const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: String,
  order: { type: Number, default: 1 }
}, { timestamps: true });

lessonSchema.plugin(aggregatePaginate);

// ✅ SINGLE EXPORT
module.exports = mongoose.model("Lesson", lessonSchema);
