const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  minutesSpent: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Activity", activitySchema);
