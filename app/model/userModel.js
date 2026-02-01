const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student"
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: function () { return !this.phone; },
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: function () { return !this.email; }
  },
  password: { type: String, required: true },
  isStudent: { type: Boolean, default: false },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  isTeacher: { type: Boolean, default: false },
  subjectTaught: String,
  institution: String,
  yearsOfExperience: Number,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.plugin(aggregatePaginate);

// ✅ SINGLE MODEL, SINGLE EXPORT
module.exports = mongoose.model("User", userSchema);