const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  courseId: mongoose.Schema.Types.ObjectId,
  totalMarks: Number
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
