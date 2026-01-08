const Rating = require("../../model/ratingModel");
const Course = require("../../model/courseModel");

class RatingApiController{

    async rateCourse(req, res){
        try{
            const { courseId, rating, review } = req.body;
            await Rating.create({
                    user: req.user._id,
                    course: courseId,
                    rating,
                    review
                });

            // recalc average
            const stats = await Rating.aggregate([
            { $match: { course: require("mongoose").Types.ObjectId(courseId) } },
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
            res.json({ message: "Rating submitted" });
        }catch(error){
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}
module.exports = new RatingApiController();

