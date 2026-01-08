const mongoose = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const quizSchema = new mongoose.Schema({
  lesson: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lesson" 
  },
  question: String,
  options: [String],
  correctAnswer: {
        type: Number,
        min: 0,
        max: 3,
        required: true
    }
});

module.exports = mongoose.model("quiz", quizSchema);
quizSchema.plugin(aggregatePaginate);
const QuizSchema = mongoose.model('Quiz', quizSchema);
module.exports = QuizSchema;