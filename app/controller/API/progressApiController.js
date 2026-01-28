const Progress = require("../../model/progressModel");
const Lesson = require("../../model/lessonModel");

class ProgressApiController {

  /* ============================
     MARK LESSON AS COMPLETED
  ============================ */
  async markCompleted(req, res) {
    try {
      const { lessonId, courseId } = req.body;

      await Progress.findOneAndUpdate(
        {
          user: req.user._id,
          lesson: lessonId
        },
        {
          user: req.user._id,
          course: courseId,
          lesson: lessonId,
          completed: true,
          completedAt: new Date()
        },
        { upsert: true }
      );

      res.json({ message: "Lesson completed" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Progress update failed" });
    }
  }

  /* ============================
     SAVE QUIZ SCORE
  ============================ */
  async saveQuizScore(req, res) {
    try {
      const { lessonId, courseId, score } = req.body;

      await Progress.findOneAndUpdate(
        {
          user: req.user._id,
          lesson: lessonId
        },
        {
          quizScore: score
        }
      );

      res.json({ message: "Quiz score saved" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Quiz progress failed" });
    }
  }

  /* ============================
     GET COURSE PROGRESS
  ============================ */
  async courseProgress(req, res) {
    try {
      const lessons = await Lesson.find({ course: req.params.courseId });
      const completed = await Progress.find({
        user: req.user._id,
        course: req.params.courseId,
        completed: true
      });

      const percentage = Math.round(
        (completed.length / lessons.length) * 100
      );

      res.json({
        totalLessons: lessons.length,
        completedLessons: completed.length,
        percentage
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Progress fetch failed" });
    }
  }
}

module.exports = new ProgressApiController();
