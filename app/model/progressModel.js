const mongoose = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  completed: Boolean,
  score: Number
});

module.exports = mongoose.model("progress", progressSchema);
progressSchema.plugin(aggregatePaginate);
const ProgressSchema = mongoose.model('Progress', progressSchema);
module.exports = ProgressSchema;