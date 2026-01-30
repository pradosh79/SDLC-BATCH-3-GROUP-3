const User = require("../../model/userModel");
const Course = require("../../model/courseModel");
const Enrollment = require("../../model/enrollmentModel");
const Progress = require("../../model/progressModel");

// Optional (if you add them)
const Activity = require("../../model/activityModel");
const Notification = require("../../model/notificationModel");





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

}

module.exports = new DashboardApiController();