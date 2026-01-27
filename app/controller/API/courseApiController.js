const Course = require("../../model/courseModel");
const Lesson = require("../../model/lessonModel");
const Rating = require("../../model/ratingModel"); // if using separate ratings
const Enrollment = require("../../model/enrollmentModel"); // optional

class CourseApiController {

  /* =====================================================
     GET ALL COURSES (HOME PAGE / COURSE LIST)
  ===================================================== */
  async getAllCourses(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 6;

      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: {
          path: "teacher",
          select: "firstName lastName"
        },
        select: `
          title
          shortDescription
          thumbnail
          price
          isFree
          level
          category
          avgRating
          totalRatings
          totalLessons
          totalDuration
        `
      };

      const result = await Course.aggregatePaginate(
        Course.aggregate([{ $match: { isPublished: true } }]),
        options
      );

      res.json(result);

    } catch (error) {
      console.log("getAllCourses error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  /* =====================================================
     SEARCH + FILTER COURSES
  ===================================================== */
  async searchCourses(req, res) {
    try {
      const { q, level, category, price } = req.query;

      const filter = { isPublished: true };

      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: "i" } },
          { tags: { $regex: q, $options: "i" } }
        ];
      }

      if (level) filter.level = level;
      if (category) filter.category = category;
      if (price === "free") filter.price = 0;

      const courses = await Course.find(filter)
        .select(`
          title
          shortDescription
          thumbnail
          price
          isFree
          level
          category
          avgRating
          totalRatings
        `)
        .sort({ createdAt: -1 });

      res.json(courses);

    } catch (error) {
      console.log("searchCourses error:", error);
      res.status(500).json({ message: "Search failed" });
    }
  }

  /* =====================================================
     CATEGORY WISE COURSES
  ===================================================== */
  async getByCategory(req, res) {
    try {
      const courses = await Course.find({
        category: req.params.name,
        isPublished: true
      })
        .select(`
          title
          shortDescription
          thumbnail
          price
          level
          avgRating
        `)
        .sort({ createdAt: -1 });

      res.json(courses);

    } catch (error) {
      console.log("getByCategory error:", error);
      res.status(500).json({ message: "Category fetch failed" });
    }
  }

  /* =====================================================
     COURSE DETAILS PAGE
  ===================================================== */
  async getCourseDetails(req, res) {
    try {
      const course = await Course.findById(req.params.id)
        .populate("teacher", "firstName lastName email")
        .lean();

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const lessons = await Lesson.find({ course: course._id })
        .select("title videoUrl duration order")
        .sort("order");

      // Reviews (if using embedded ratings)
      const reviews = course.ratings || [];

      // Enrollment check (optional)
      let isEnrolled = false;
      if (req.user) {
        const enrolled = await Enrollment.findOne({
          user: req.user._id,
          course: course._id
        });
        isEnrolled = !!enrolled;
      }

      res.json({
        course,
        lessons,
        reviews,
        isEnrolled
      });

    } catch (error) {
      console.log("getCourseDetails error:", error);
      res.status(500).json({ message: "Course details fetch failed" });
    }
  }

  /* =====================================================
     RELATED COURSES (OPTIONAL BUT USEFUL)
  ===================================================== */
  async relatedCourses(req, res) {
    try {
      const course = await Course.findById(req.params.id);

      const related = await Course.find({
        _id: { $ne: course._id },
        category: course.category,
        isPublished: true
      })
        .limit(4)
        .select("title thumbnail price avgRating");

      res.json(related);

    } catch (error) {
      console.log("relatedCourses error:", error);
      res.status(500).json({ message: "Failed to load related courses" });
    }
  }
}

module.exports = new CourseApiController();
