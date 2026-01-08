const Lesson = require("../model/lessonModel");
const cloudinary = require("../config/cloudinary");

class AdminLessonController {

  async index(req, res) {
    const lessons = await Lesson.find({ course: req.params.courseId });
    res.render("admin/lessons/index", { lessons, courseId: req.params.courseId, admin: req.user });
  }

  async store(req, res) {
    const video = await cloudinary.uploader.upload(req.file.path, { resource_type: "video" });

    await Lesson.create({
      course: req.body.courseId,
      title: req.body.title,
      videoUrl: video.secure_url
    });

    res.redirect("/admin/lessons/" + req.body.courseId);
  }

  async delete(req, res) {
    const lesson = await Lesson.findById(req.params.id);
    await Lesson.findByIdAndDelete(req.params.id);
    res.redirect("/admin/lessons/" + lesson.course);
  }
}

module.exports = new AdminLessonController();
