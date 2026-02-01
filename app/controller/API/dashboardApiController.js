const User = require("../../model/userModel");
const Course = require("../../model/courseModel");
const Enrollment = require("../../model/enrollmentModel");
const Progress = require("../../model/progressModel");

// Optional (if you add them)
const Activity = require("../../model/activityModel");
const Notification = require("../../model/notificationModel");
const Lesson = require("../../model/lessonModel");
const Rating = require("../../model/ratingModel");


class DashboardApiController {
async getMe(req, res){
  try{
    const user = await User.findById(req.user._id).select("firstName lastName email avatar");
    res.json(user);
  }catch (error) {
    console.log("getAllCourses error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async getOverview(req, res){
  try{
    const enrollment = await Enrollment.findOne({
    user: req.user._id
  }).populate("course");

  if (!enrollment) {
    return res.json(null);
  }

  const progress = await Progress.findOne({
    user: req.user._id,
    course: enrollment.course._id
  });

  res.json({
    courseTitle: enrollment.course.title,
    duration: enrollment.course.duration,
    chapters: enrollment.course.totalChapters,
    videos: enrollment.course.totalVideos,
    completion: progress ? progress.percentage : 0
  });

  }catch (error) {
    console.log("getAllCourses error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async getProgress(req, res){
  try{
    const enrolledCount = await Enrollment.countDocuments({user: req.user._id});

  const completedCount = await Progress.countDocuments({
    user: req.user._id,
    percentage: 100
  });

  const progress = await Progress.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: null,
        totalHours: { $sum: "$totalHours" }
      }
    }
  ]);

  res.json({
    totalHours: progress[0]?.totalHours || 0,
    enrolledCourses: enrolledCount,
    completedCourses: completedCount
  });

  }catch (error) {
    console.log("getAllCourses error:", error);
    res.status(500).json({ message: "Server error" });
  }

}

async getActivity(req, res){
  try{
        const activity = await Activity.find({user: req.user._id}).sort({ date: 1 });
        res.json(activity);
  }catch (error) {
    console.log("getAllCourses error:", error);
    res.status(500).json({ message: "Server error" });
  }

}

async getStudyStats(req, res){
  try{
    const stats = await Activity.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: { $dayOfWeek: "$date" },
        minutes: { $sum: "$minutesSpent" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  res.json(stats);

  }catch (error) {
    console.log("getAllCourses error:", error);
    res.status(500).json({ message: "Server error" });
  }
}


async getGauge (req, res){
  try{
    const progress = await Progress.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: null,
        avgProgress: { $avg: "$percentage" }
      }
    }
  ]);

  res.json({
    percentage: Math.round(progress[0]?.avgProgress || 0)
  });

  }catch (error) {
    console.log("getAllCourses error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async getNotifications(req, res){
  try{
    const notifications = await Notification.find({
    user: req.user._id
  }).sort({ createdAt: -1 });

  res.json(notifications);
  }catch (error) {
    console.log("getAllCourses error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async logout(req, res){
  try{
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  }catch (error) {
    console.log("getAllCourses error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async getMentors(req, res){
  try {
        const mentors = await Course.aggregate([
    {
      $group: {
        _id: "$teacher",
        courseCount: { $sum: 1 }
      }
    },
    { $sort: { courseCount: -1 } },
    { $limit: 6 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "teacher"
      }
    },
    { $unwind: "$teacher" },
    {
      $project: {
        _id: "$teacher._id",
        firstName: "$teacher.firstName",
        lastName: "$teacher.lastName",
        avatar: "$teacher.avatar",
        skills: "$teacher.skills",
        courseCount: 1
      }
    }
  ]);

  res.json(mentors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load mentors" });
  }
}


async dashboardProgress(req, res){
  try {
    const userId = req.user.id;

    /* ===============================
       1. Weekly Study Goal
    =============================== */
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const weeklyStudy = await Progress.aggregate([
      {
        $match: {
          user: userId,
          updatedAt: { $gte: weekStart }
        }
      },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: "$watchTime" }
        }
      }
    ]);

    const weeklyHours =
      (weeklyStudy[0]?.totalMinutes || 0) / 60;

    const weeklyGoal = 10; // configurable

    /* ===============================
       2. Total Courses Completed
    =============================== */
    const completedCourses =
      await Enrollment.countDocuments({
        user: userId,
        completed: true
      });

    /* ===============================
       3. My Current Courses
    =============================== */
    const currentCourses = await Enrollment.find({
      user: userId
    })
      .populate("course", "title thumbnail")
      .select("progress completed");

    /* ===============================
       4. Learning Progress
    =============================== */
    const progressAgg = await Enrollment.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          avgProgress: { $avg: "$progress" }
        }
      }
    ]);

    const learningProgress =
      Math.round(progressAgg[0]?.avgProgress || 0);

    /* ===============================
       5. Skill Progress
       (Example: IT vs Non-IT)
    =============================== */
    const skillAgg = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course"
        }
      },
      { $unwind: "$course" },
      {
        $group: {
          _id: "$course.category",
          progress: { $avg: "$progress" }
        }
      }
    ]);

    /* ===============================
       6. Overall Progress
    =============================== */
    const overallProgress = learningProgress;

    /* ===============================
       7. Upcoming Courses
    =============================== */
    const upcomingCourses = await Enrollment.find({
      user: userId,
      progress: { $lt: 100 }
    })
      .populate("course", "title")
      .limit(5);

    /* ===============================
       8. Upcoming Lessons
    =============================== */
    const upcomingLessons = await Lesson.find({
      isPublished: true
    })
      .sort({ order: 1 })
      .limit(5)
      .select("title course");

    /* ===============================
       9. Recent Activity
    =============================== */
    const activities = await Activity.find({
      user: userId
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      weeklyStudyGoal: {
        goalHours: weeklyGoal,
        completedHours: weeklyHours
      },
      fundamentals: learningProgress,
      totalCoursesCompleted: completedCourses,
      currentCourses,
      learningProgress,
      skillProgress: skillAgg,
      overallProgress,
      upcomingCourses,
      upcomingLessons,
      recentActivity: activities
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async courseDashboard(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /* ================= USER INFO ================= */
    const user = await User.findById(userId).select(
      "firstName lastName role"
    );

    /* ================= ENROLLED COURSES ================= */
    const enrollments = await Enrollment.find({ user: userId })
      .populate({
        path: "course",
        populate: {
          path: "teacher",
          select: "firstName lastName"
        }
      });

    const allCourses = enrollments
      .filter(e => e.course) // 🚨 IMPORTANT
      .map(e => ({
        _id: e.course._id,
        title: e.course.title || "Untitled Course",
        thumbnail: e.course.thumbnail || "",
        duration: "2hr 10min",
        chapters: 10,
        videos: 15,
        progress: e.progress ?? 0,
        teacher: e.course.teacher
          ? `${e.course.teacher.firstName ?? ""} ${e.course.teacher.lastName ?? ""}`.trim()
          : "Unknown Instructor"
      }));

    const ongoing = allCourses.filter(c => c.progress < 100);
    const completed = allCourses.filter(c => c.progress === 100);

    /* ================= POPULAR COURSES ================= */
    const popularCourses = await Course.aggregate([
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "course",
          as: "ratings"
        }
      },
      {
        $addFields: {
          avgRating: { $ifNull: [{ $avg: "$ratings.rating" }, 0] }
        }
      },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          thumbnail: 1
        }
      }
    ]);

    /* ================= FINAL RESPONSE ================= */
    res.json({
      user: {
        name: user ? `Hi ${user.firstName}` : "Hi Learner",
        subtitle: "Lets learn something new today."
      },
      stats: {
        totalCourses: allCourses.length,
        completedCourses: completed.length,
        ongoingCourses: ongoing.length
      },
      courses: {
        all: allCourses,
        ongoing,
        completed
      },
      popularCourses
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: error.message });
  }
}

}

module.exports = new DashboardApiController();