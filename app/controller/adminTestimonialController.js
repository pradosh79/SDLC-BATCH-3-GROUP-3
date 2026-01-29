const Testimonial = require("../model/testimonialModel");
const deleteCloudinaryImage = require("../helper/deleteCloudinaryImage");

class AdminTestimonialController {

  // LIST
  async index(req, res) {
    const testimonials = await Testimonial.find().sort({ position: 1 });

    res.render("admin/about/testimonials/index", {
      testimonials,
      admin: req.user
    });
  }

  // CREATE
  async store(req, res) {
    try {
      if (!req.file?.path) {
        return res.status(400).send("Image required");
      }

      await Testimonial.create({
        name: req.body.name,
        role: req.body.role,
        message: req.body.message,
        rating: req.body.rating,
        image: req.file.path, // Cloudinary URL
        position: req.body.position || 0
      });

      res.redirect("/admin/about/testimonials");
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to add testimonial");
    }
  }

  // UPDATE
  async update(req, res) {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      if (!testimonial) return res.redirect("/admin/about/testimonials");

      const updateData = {
        name: req.body.name,
        role: req.body.role,
        message: req.body.message,
        rating: req.body.rating,
        position: req.body.position,
        isActive: req.body.isActive === "on"
      };

      if (req.file && req.file.path) {
          await deleteCloudinaryImage(testimonial.image);
          updateData.image = req.file.path;
       }

      await Testimonial.findByIdAndUpdate(req.params.id, updateData);
      res.redirect("/admin/about/testimonials");

    } catch (err) {
      console.error(err);
      res.status(500).send("Update failed");
    }
  }

  // DELETE
  async delete(req, res) {
    try {
      await Testimonial.findByIdAndDelete(req.params.id);
      res.redirect("/admin/about/testimonials");
    } catch (err) {
      console.error(err);
      res.status(500).send("Delete failed");
    }
  }
}

module.exports = new AdminTestimonialController();
