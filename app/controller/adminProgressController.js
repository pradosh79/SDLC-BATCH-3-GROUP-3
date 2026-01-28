const Progress = require("../model/progressModel");
const Course = require("../model/courseModel");
const User = require("../model/userModel");
const Lesson = require("../model/lessonModel");

class AdminProgressController {

  async index(req, res) {
    const { courseId, studentId } = req.query;

    const filter = {};

    if (courseId) filter.course = courseId;
    if (studentId) filter.user = studentId;

    const progress = await Progress.find(filter)
      .populate("user", "firstName email")
      .populate("course", "title")
      .populate("lesson", "title");

    const courses = await Course.find().select("title");
    const students = await User.find({ role: "student" }).select("firstName");

    res.render("admin/progress/index", {
      progress,
      courses,
      students,
      selectedCourse: courseId || "",
      selectedStudent: studentId || "",
      admin: req.user
    });
  }

  async courseCompletion(req, res) {
  const { courseId } = req.params;

  const totalLessons = await Lesson.countDocuments({ course: courseId });

  const completed = await Progress.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId), completed: true } },
    { $group: { _id: "$user", count: { $sum: 1 } } }
  ]);

  const completion = completed.map(c => ({
    userId: c._id,
    percentage: Math.round((c.count / totalLessons) * 100)
  }));

  res.json(completion);
}

}

module.exports = new AdminProgressController();

