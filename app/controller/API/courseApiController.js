const Course = require("../../model/courseModel");
const Lesson = require("../../model/lessonModel");

class CourseApiController {
   
    async getAllCourses(req, res){
        try{
            const courses = await Course.find({ isPublished: true }).populate("teacher");
            res.json(courses);
        }catch(error) {
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async searchCourses(req,res){
        try{
            const { q, level, category } = req.query;
            const filter = {};
            if (q) filter.title = { $regex: q, $options: "i" };
            if (level) filter.level = level;
            if (category) filter.category = category;
            const courses = await Course.find(filter);
            res.json(courses);
        }catch(error) {
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" });
        }

    }

    async getCourseDetails(req, res){
        try{
            const course = await Course.findById(req.params.id).populate("teacher");
            const lessons = await Lesson.find({ course: course._id });
            res.json({ course, lessons });
        }catch(error) {
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}

module.exports = new CourseApiController();