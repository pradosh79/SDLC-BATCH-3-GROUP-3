const Course = require("../../model/courseModel");
const Lesson = require("../../model/lessonModel");

class CourseApiController {
   
    /* ------------------------------------
        GET ALL COURSES (HOME PAGE)
    ------------------------------------ */
    async getAllCourses(req, res){
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 6;

        const options = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: "teacher",
                select: "title shortDescription thumbnail price level avgRating totalRatings category"
            };
            const result = await Course.aggregatePaginate(
            Course.aggregate([{ $match: { isPublished: true } }]),
            options
        );
        res.json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server error" });
        }
    }


/* ------------------------------------
   SEARCH + FILTER
------------------------------------ */
async searchCourses(req, res){
  try {

    const { q, level, category } = req.query;

    const filter = { isPublished: true };

    if (q) filter.title = { $regex: q, $options: "i" };
    if (level) filter.level = level;
    if (category) filter.category = category;

    const courses = await Course.find(filter)
      .select("title shortDescription thumbnail price level avgRating category");

    res.json(courses);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Search failed" });
  }
}


/* ------------------------------------
   CATEGORY WISE
------------------------------------ */
async getByCategory(req, res){
  try {

    const courses = await Course.find({
      category: req.params.name,
      isPublished: true
    });

    res.json(courses);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Category fetch failed" });
  }
}


/* ------------------------------------
   COURSE DETAILS PAGE
------------------------------------ */
async getCourseDetails(req, res){
  try {

    const course = await Course.findById(req.params.id)
      .populate("teacher", "firstName lastName");

    const lessons = await Lesson.find({ course: course._id })
      .sort("order");

    res.json({
      course,
      lessons
    });

  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Course not found" });
  }
}

}

module.exports = new CourseApiController();