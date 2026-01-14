const Quiz = require("../../model/quizModel");

class QuizApiController{

        async getQuizByLesson(req, res){
            try{
                const quiz = await Quiz.find({ lesson: req.params.lessonId });
                res.json(quiz);
            }catch(error){
                console.log('error', error.message);
                return res.status(500).json({ message: "Internal server error" });
            }
        
        }

        async submitQuiz(req, res) {
  try {

    // 1️⃣ Validate body
    if (!req.body || !Array.isArray(req.body.answers)) {
      return res.status(400).json({
        message: "Invalid request format. answers array required"
      });
    }

    const answers = req.body.answers;
    let score = 0;

    for (const q of answers) {

      // 2️⃣ Validate each answer
      if (!q.questionId || q.selected === undefined) continue;

      const dbQ = await Quiz.findById(q.questionId);

      if (!dbQ) continue; // question not found

      // 3️⃣ Convert selected to Number
      if (Number(dbQ.correctAnswer) === Number(q.selected)) {
        score++;
      }
    }

    return res.json({
      totalQuestions: answers.length,
      score
    });

  } catch (error) {
    console.log("submitQuiz error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

}
module.exports = new QuizApiController();