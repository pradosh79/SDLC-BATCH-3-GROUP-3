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

        async submitQuiz(req, res){
                try{
                    const { answers } = req.body;

                let score = 0;

                for (let q of answers) {
                    const dbQ = await Quiz.findById(q.questionId);
                    if (dbQ.correctAnswer === q.selected) score++;
                }
                res.json({ score });
                }catch(error){
                    console.log('error', error.message);
                    return res.status(500).json({ message: "Internal server error" });
                }
        }

}
module.exports = new QuizApiController();