const Course = require("../../model/courseModel");
const Lesson = require("../../model/lessonModel");
const Rating = require("../../model/ratingModel"); // if using separate ratings
const Enrollment = require("../../model/enrollmentModel");
const Category=require("../../model/categoryModel"); // optional
const TrustedBy = require("../../model/trustedByModel");
const Testimonial = require("../../model/testimonialModel");
const Assignment = require("../../model/assignment");
const Submission = require("../../model/submission");




class CourseApiController {

  /* =====================================================
     GET ALL COURSES (HOME PAGE / COURSE LIST)
  ===================================================== */
  async getAllCourses(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    const aggregate = Course.aggregate([
      // 🔥 TEMP: NO MATCH
      {
        $lookup: {
          from: "users",
          localField: "teacher",
          foreignField: "_id",
          as: "teacher"
        }
      },
      {
        $unwind: {
          path: "$teacher",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          title: 1,
          shortDescription: 1,
          thumbnail: 1,
          price: 1,
          isFree: 1,
          level: 1,
          teacher: {
            firstName: "$teacher.firstName",
            lastName: "$teacher.lastName"
          }
        }
      }
    ]);

    const result = await Course.aggregatePaginate(aggregate, {
      page,
      limit
    });

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
  
  async getPopularCourses(req, res){
  try {
    const courses = await Course.find({ isPopular: true });
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// GET best selling courses
async getBestSellingCourses(req, res){
  try {
    const courses = await Course.find({ isPublished: true })
    .sort({ totalEnrollments: -1 })
    .limit(10)
    .populate("category", "name")
    .populate("teacher", "firstName lastName");
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async getCourseById(req, res){
  try {
    const course = await Course.findById(req.params.id);
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(404).json({ success: false, message: "Course not found" });
  }
}

// GET all categories (Public)
async getCategories(req, res) {
  try {
    const categories = await Category.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "category",
          as: "courses"
        }
      },
      {
        $addFields: {
          courses: {
            $filter: {
              input: "$courses",
              as: "course",
              cond: { $eq: ["$$course.isPublished", true] }
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "courses.teacher",
          foreignField: "_id",
          as: "teachers"
        }
      },
      {
        $addFields: {
          courses: {
            $map: {
              input: "$courses",
              as: "course",
              in: {
                _id: "$$course._id",
                title: "$$course.title",
                price: "$$course.price",
                avgRating: "$$course.avgRating",
                totalRatings: "$$course.totalRatings",
                level: "$$course.level",
                thumbnail: "$$course.thumbnail",

                teacher: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$teachers",
                        as: "t",
                        cond: { $eq: ["$$t._id", "$$course.teacher"] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },

      // 📊 Count total courses
      {
        $addFields: {
          totalCourses: { $size: "$courses" }
        }
      },

      // 🧼 Clean response
      {
        $project: {
          teachers: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: categories
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load categories"
    });
  }
}

async homePageStudentViewCourses(req, res) {
    try {
      const courses = await Course.aggregate([
        {
          $match: {
            isPublished: true
          }
        },
        {
          $sort: {
            enrolledCount: -1,     // popularity
            avgRating: -1          // rating
          }
        },
        {
          $limit: 6               // only show 3–6 cards
        },
        {
          $project: {
            title: 1,
            shortDescription: 1,
            thumbnail: 1,
            avgRating: 1,
            totalRatings: 1,
            enrolledCount: 1
          }
        }
      ]);

      res.json({
        success: true,
        data: courses
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to load home courses"
      });
    }
  }

  async getTrustedBy(req, res) {
  try {
    const logos = await TrustedBy.find({ isActive: true })
      .sort({ position: 1 })
      .select("companyName logo website");

    res.json({
      success: true,
      data: logos
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load trusted by logos"
    });
  }
}

 async getTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ position: 1 })
      .select("name role message rating image");

    res.json({
      success: true,
      data: testimonials
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load testimonials"
    });
  }
}

async getAssignmentSummary(req, res){
  try {
    const studentId = req.user.id;
    const now = new Date();

    const totalAssignments = await Assignment.countDocuments();

    const completed = await Submission.countDocuments({
      studentId,
      status: "completed"
    });

    const pending = await Submission.countDocuments({
      studentId,
      status: "pending"
    });

    const overdue = await Submission.countDocuments({
      studentId,
      status: "pending",
      submittedAt: { $exists: false },
    });

    res.json({
      totalAssignments,
      completed,
      pending,
      overdue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async getCurrentAssignments(req, res){
  try {
    const studentId = req.user.id;
    const now = new Date();

    const assignments = await Assignment.aggregate([
      {
        $lookup: {
          from: "submissions",
          let: { assignmentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$assignmentId", "$$assignmentId"] },
                    { $eq: ["$studentId", mongoose.Types.ObjectId(studentId)] }
                  ]
                }
              }
            }
          ],
          as: "submission"
        }
      },
      { $unwind: { path: "$submission", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          dueDate: { $gte: now }
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          dueDate: 1,
          status: { $ifNull: ["$submission.status", "pending"] },
          score: "$submission.score"
        }
      }
    ]);

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async submitAssignment(req, res){
  try {
    const studentId = req.user.id;
    const { assignmentId } = req.params;

    // Check assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    // Check existing submission
    let submission = await Submission.findOne({
      studentId,
      assignmentId
    });

    if (submission && submission.status !== "pending") {
      return res.status(400).json({
        message: "Assignment already submitted"
      });
    }

    // Create submission if not exists
    if (!submission) {
      submission = new Submission({
        studentId,
        assignmentId
      });
    }

    submission.status = "submitted";
    submission.submittedAt = new Date();

    await submission.save();

    res.status(200).json({
      message: "Assignment submitted successfully",
      submission
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async searchAssignments(req, res){
  try {
    const studentId = req.user.id;
    const search = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matchStage = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    };

    const assignments = await Assignment.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "submissions",
          let: { assignmentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$assignmentId", "$$assignmentId"] },
                    { $eq: ["$studentId", mongoose.Types.ObjectId(studentId)] }
                  ]
                }
              }
            }
          ],
          as: "submission"
        }
      },
      { $unwind: { path: "$submission", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          description: 1,
          dueDate: 1,
          status: { $ifNull: ["$submission.status", "pending"] },
          score: "$submission.score"
        }
      },
      { $sort: { dueDate: 1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await Assignment.countDocuments(matchStage);

    res.json({
      data: assignments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async getUpcomingAssignments(req, res){
  try {
    const studentId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const now = new Date();

    const matchStage = {
      dueDate: { $gt: now },
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    };

    const assignments = await Assignment.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "submissions",
          let: { assignmentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$assignmentId", "$$assignmentId"] },
                    { $eq: ["$studentId", mongoose.Types.ObjectId(studentId)] }
                  ]
                }
              }
            }
          ],
          as: "submission"
        }
      },
      { $unwind: { path: "$submission", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          description: 1,
          dueDate: 1,
          status: { $ifNull: ["$submission.status", "pending"] }
        }
      },
      { $sort: { dueDate: 1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await Assignment.countDocuments(matchStage);

    res.json({
      data: assignments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async getPastAssignments(req, res){
  try {
    const studentId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const now = new Date();

    const matchStage = {
      dueDate: { $lt: now },
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    };

    const assignments = await Assignment.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "submissions",
          let: { assignmentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$assignmentId", "$$assignmentId"] },
                    { $eq: ["$studentId", mongoose.Types.ObjectId(studentId)] }
                  ]
                }
              }
            }
          ],
          as: "submission"
        }
      },
      { $unwind: { path: "$submission", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          description: 1,
          dueDate: 1,
          status: { $ifNull: ["$submission.status", "pending"] },
          score: "$submission.score"
        }
      },
      { $sort: { dueDate: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await Assignment.countDocuments(matchStage);

    res.json({
      data: assignments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


}

module.exports = new CourseApiController();
