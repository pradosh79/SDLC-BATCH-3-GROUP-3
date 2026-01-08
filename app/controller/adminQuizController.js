const Quiz = require("../model/quizModel");

class AdminQuizController {

  async index(req, res) {
    const quiz = await Quiz.find({ lesson: req.params.lessonId });
    res.render("admin/quiz/index", { quiz, lessonId: req.params.lessonId, admin: req.user });
  }

  async store(req, res) {
    try {

    console.log("BODY:", req.body); // 🔥 debug once

    await Quiz.create({
      lesson: req.body.lessonId,
      question: req.body.question,
      options: [req.body.a, req.body.b, req.body.c, req.body.d],
      correctAnswer: Number(req.body.correct)
    });

    res.redirect("/admin/quiz/" + req.body.lessonId);

  } catch (err) {
    console.log(err);
    res.send("Quiz save failed");
  }
  }

  async delete(req, res) {
    const q = await Quiz.findById(req.params.id);
    await Quiz.findByIdAndDelete(req.params.id);
    res.redirect("/admin/quiz/" + q.lesson);
  }
}

module.exports = new AdminQuizController();
