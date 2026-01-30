const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "assignment"
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
