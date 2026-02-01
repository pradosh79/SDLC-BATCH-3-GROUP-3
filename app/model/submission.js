const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment"
  },
  status: {
    type: String,
    enum: ["pending", "submitted", "completed"],
    default: "pending"
  },
  score: Number,
  submittedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
