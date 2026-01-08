const Enrollment = require("../../model/enrollmentModel");
class EnrollApiController{

    async enrollCourse(req, res){
        try{
                await Enrollment.create({
                    user: req.user._id,
                    course: req.body.courseId
                });
                res.json({ message: "Enrolled successfully" });
        }catch(error){
                console.log('error', error.message);
                return res.status(500).json({ message: "Internal server error" });
        }
    }

    async myCourses(req, res){
        try{
            const data = await Enrollment.find({ user: req.user._id }).populate("course");
            res.json(data);
        }catch(error){
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}
module.exports = new EnrollApiController();