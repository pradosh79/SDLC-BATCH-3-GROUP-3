const Course = require("../../model/courseModel");
const Enrollment = require("../../model/enrollmentModel");

class TeacherDashboardController{

    async dashboard(req, res){
            try{
                const courses = await Course.find({ teacher: req.user._id });
                const courseIds = courses.map(c => c._id);
                const students = await Enrollment.countDocuments({
                        course: { $in: courseIds }
                    });
                //const totalEarning = students * 499; // demo
                res.json({
                        totalCourses: courses.length,
                        totalStudents: students,
                        //totalEarning,
                        courses
                        });
            }catch(error){
                console.log('error', error.message);
                return res.status(500).json({ message: "Internal server error" });
            }
    }

}
module.exports = new TeacherDashboardController();