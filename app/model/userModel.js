const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const userSchema = new mongoose.Schema({

  // ===== COMMON FOR ALL =====
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student"
  },

  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: function () {
      return !this.phone; // email required if phone not present
    },
    unique: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    required: function () {
      return !this.email; // phone required if email not present
    }
  },

  password: {
    type: String,
    required: true
  },

  // ===== STUDENT ONLY =====
  isStudent: {
    type: Boolean,
    default: false
  },

  // future use (course enroll, dashboard etc)
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],

  // ===== TEACHER ONLY =====
  isTeacher: {
    type: Boolean,
    default: false
  },

  subjectTaught: {
    type: String
  },

  institution: {
    type: String
  },

  yearsOfExperience: {
    type: Number
  },

  // ===== STATUS & META =====
  isVerified: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
userSchema.plugin(aggregatePaginate);
const UserModel = mongoose.model('user',userSchema);
module.exports = UserModel;