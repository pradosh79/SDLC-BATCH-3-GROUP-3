const Lesson = require("../../model/lessonModel");

class LessonApiController {

async getLessonsByCourse(req, res){
     try{
        const lessons = await Lesson.find({ course: req.params.courseId }).sort("order");
        res.json(lessons);
     }catch(error){
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" });
     }
        
    }
}


module.exports = new LessonApiController();