const Lesson = require("../model/lessonModel");
const Course = require("../model/courseModel");

class AdminLessonController {

  async index(req, res) {
    const course = await Course.findById(req.params.courseId);
    const lessons = await Lesson.find({ course: course._id }).sort("order");

    res.render("admin/lessons/index", {
      course,
      lessons,
      admin: req.user
    });
  }

  async createForm(req, res) {
    res.render("admin/lessons/create", {
      courseId: req.params.courseId,
      admin: req.user
    });
  }

  async store(req, res) {
    await Lesson.create({
      course: req.body.courseId,
      title: req.body.title,
      videoUrl: req.file.path,
      duration: req.body.duration,
      order: req.body.order
    });

    await Course.findByIdAndUpdate(req.body.courseId, {
      $inc: { totalLessons: 1 }
    });

    res.redirect(`/admin/courses/${req.body.courseId}/lessons`);
  }

  async editForm(req, res) {
    const lesson = await Lesson.findById(req.params.id);
    res.render("admin/lessons/edit", {
      lesson,
      admin: req.user
    });
  }

  async update(req, res) {
    const data = {
      title: req.body.title,
      duration: req.body.duration,
      order: req.body.order
    };

    if (req.file) data.videoUrl = req.file.path;

    await Lesson.findByIdAndUpdate(req.params.id, data);
    res.redirect(`/admin/courses/${req.body.courseId}/lessons`);
  }

  async delete(req, res) {
    const lesson = await Lesson.findById(req.params.id);
    await lesson.deleteOne();

    await Course.findByIdAndUpdate(lesson.course, {
      $inc: { totalLessons: -1 }
    });

    res.redirect(`/admin/courses/${lesson.course}/lessons`);
  }
}

module.exports = new AdminLessonController();
