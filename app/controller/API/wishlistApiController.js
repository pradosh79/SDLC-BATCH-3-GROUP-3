const Wishlist = require("../../model/wishlistModel");

class WishlistApiController {

  async toggle(req, res) {
    try {
      const { courseId } = req.body;

      const exists = await Wishlist.findOne({
        user: req.user._id,
        course: courseId
      });

      if (exists) {
        await exists.deleteOne();
        return res.json({ message: "Removed from wishlist" });
      }

      await Wishlist.create({
        user: req.user._id,
        course: courseId
      });

      res.json({ message: "Added to wishlist" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Wishlist failed" });
    }
  }

  async list(req, res) {
    try {
      const list = await Wishlist.find({ user: req.user._id })
        .populate("course");

      res.json(list);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to load wishlist" });
    }
  }
}

module.exports = new WishlistApiController();
