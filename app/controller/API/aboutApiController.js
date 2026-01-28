const About =require("../../model/aboutModel");
const Course=require("../../model/courseModel");
const User=require("../../model/userModel");
const CourseSold=require("../../model/enrollmentModel");

class AboutApiController {

    // GET /api/about
    async list(req, res) {
  try {
    const totalCourses = await Course.countDocuments();

    const totalTutors = await User.countDocuments({ role: "teacher" });

    const coursesSold = await CourseSold.countDocuments();

    const teachersDetails = await User.find({ role: "teacher" })
      .select(
        "firstName lastName email subjectTaught institution yearsOfExperience createdAt"
      );

    const about = await About.findOne().sort({ createdAt: -1 });

    res.json({
      totalCourses,
      totalTutors,
      coursesSold,
      teachersDetails,
      about
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

  // GET /api/about/:id
  async get(req, res) {
    try {
      const about = await About.findById(req.params.id);
      if (!about) return res.status(404).json({ message: "Not found" });
      res.json(about);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

}

module.exports = new AboutApiController();