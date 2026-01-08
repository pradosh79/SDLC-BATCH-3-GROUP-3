const Enrollment = require("../../model/enrollmentModel");
const Progress = require("../../model/progressModel");

class studentDashboardController{

    async dashboard(req, res){
        try{
            const enrollments = await Enrollment.find({ user: req.user._id }).populate("course");
            const progress = await Progress.find({ user: req.user._id });

            const completed = progress.filter(p => p.completed).length;

            res.json({
                totalCourses: enrollments.length,
                completedLessons: completed,
                courses: enrollments
            })
        }catch(error){
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}
module.exports = new studentDashboardController();