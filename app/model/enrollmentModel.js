const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({

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

  enrolledAt: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active"
  }

}, { timestamps: true });


// ✅ prevent duplicate enrollment (same user + same course)
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
