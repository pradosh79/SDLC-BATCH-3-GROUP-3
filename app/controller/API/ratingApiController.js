const Rating = require("../../model/ratingModel");
const Course = require("../../model/courseModel");
const mongoose = require("mongoose");

class RatingApiController {

  async submit(req, res) {
    try {
      const { courseId, rating, review } = req.body;

      await Rating.findOneAndUpdate(
        { user: req.user._id, course: courseId },
        { rating, review },
        { upsert: true, new: true }
      );

      // Recalculate rating
      const stats = await Rating.aggregate([
        { $match: { course: new mongoose.Types.ObjectId(courseId) } },
        {
          $group: {
            _id: "$course",
            avg: { $avg: "$rating" },
            count: { $sum: 1 }
          }
        }
      ]);

      await Course.findByIdAndUpdate(courseId, {
        avgRating: stats[0].avg,
        totalRatings: stats[0].count
      });

      res.json({ message: "Rating submitted successfully" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Rating failed" });
    }
  }
}

module.exports = new RatingApiController();
