const Course = require("../model/courseModel");
const User = require("../model/userModel");
const cloudinary = require("../helper/cloudinary");

class AdminCourseController {

  /* ============================
     LIST COURSES
  ============================ */
  async index(req, res) {
    try {
      const courses = await Course.find()
        .populate("teacher", "firstName lastName email")
        .sort({ createdAt: -1 });

      res.render("admin/courses/index", {
        courses,
        admin: req.user
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Failed to load courses");
    }
  }

  /* ============================
     CREATE FORM
  ============================ */
  async createForm(req, res) {
    try {
      const teachers = await User.find({ role: "teacher" });

      res.render("admin/courses/create", {
        teachers,
        admin: req.user
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Failed to load form");
    }
  }

  /* ============================
     STORE COURSE
  ============================ */
  async store(req, res) {
    try {

      // Thumbnail uploaded via CloudinaryStorage
      const thumbnailUrl = req.file ? req.file.path : null;

      if (!thumbnailUrl) {
        return res.redirect("/admin/courses/create");
      }

      const course = new Course({
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        longDescription: req.body.longDescription || "",
        teacher: req.body.teacher,
        thumbnail: thumbnailUrl,

        category: req.body.category || "General",
        level: req.body.level || "Beginner",
        tags: req.body.tags ? req.body.tags.split(",") : [],

        price: req.body.price || 0,
        isFree: req.body.price == 0,

        isPublished: req.body.isPublished === "on",
        publishedAt: req.body.isPublished === "on" ? new Date() : null
      });

      await course.save();

      res.redirect("/admin/courses");

    } catch (error) {
      console.log("Course create error:", error);
      res.status(500).send("Course creation failed");
    }
  }

  /* ============================
     EDIT FORM
  ============================ */
  async editForm(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      const teachers = await User.find({ role: "teacher" });

      if (!course) {
        return res.redirect("/admin/courses");
      }

      res.render("admin/courses/edit", {
        course,
        teachers,
        admin: req.user
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Edit form load failed");
    }
  }

  /* ============================
     UPDATE COURSE
  ============================ */
  async update(req, res) {
    try {

      const updateData = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        longDescription: req.body.longDescription,
        teacher: req.body.teacher,
        category: req.body.category,
        level: req.body.level,
        tags: req.body.tags ? req.body.tags.split(",") : [],
        price: req.body.price || 0,
        isFree: req.body.price == 0,
        isPublished: req.body.isPublished === "on"
      };

      // Update thumbnail only if uploaded
      if (req.file) {
        updateData.thumbnail = req.file.path;
      }

      // Set publish date
      if (req.body.isPublished === "on") {
        updateData.publishedAt = new Date();
      }

      await Course.findByIdAndUpdate(req.params.id, updateData);

      res.redirect("/admin/courses");

    } catch (error) {
      console.log("Course update error:", error);
      res.status(500).send("Update failed");
    }
  }

  /* ============================
     DELETE COURSE
  ============================ */
  async delete(req, res) {
    try {
      await Course.findByIdAndDelete(req.params.id);
      res.redirect("/admin/courses");
    } catch (error) {
      console.log(error);
      res.status(500).send("Delete failed");
    }
  }
}

module.exports = new AdminCourseController();
