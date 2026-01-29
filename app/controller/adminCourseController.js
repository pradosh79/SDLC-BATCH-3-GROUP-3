const Course = require("../model/courseModel");
const User = require("../model/userModel");
const cloudinary = require("../helper/cloudinary");
const Category = require("../model/categoryModel");
const deleteCloudinaryImage = require("../helper/deleteCloudinaryImage");


class AdminCourseController {

  /* ============================
     LIST COURSES
  ============================ */
  async index(req, res) {
  try {
    const courses = await Course.find()
      .populate("teacher", "firstName lastName email")
      .populate("category", "name") // ✅ IMPORTANT
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
    const categories = await Category.find({ isActive: true });

    res.render("admin/courses/create", {
      teachers,
      categories,
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
    console.log("FILE:", req.file);

    if (!req.file || !req.file.path) {
      return res.status(400).send("Image required");
    }

    const course = new Course({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription || "",
      teacher: req.body.teacher,

      // ✅ Cloudinary URL (already uploaded)
      thumbnail: req.file.path,

      category: req.body.category,
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
    console.error("Course create error:", error);
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
    const categories = await Category.find({ isActive: true });

    if (!course) {
      return res.redirect("/admin/courses");
    }

    res.render("admin/courses/edit", {
      course,
      teachers,
      categories,
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
    const course = await Course.findById(req.params.id);
    if (!course) return res.redirect("/admin/courses");

    const updateData = {
      title: req.body.title?.trim(),
      shortDescription: req.body.shortDescription?.trim(),
      longDescription: req.body.longDescription?.trim(),
      teacher: req.body.teacher,
      category: req.body.category,
      level: req.body.level,
      tags: req.body.tags
        ? req.body.tags.split(",").map(t => t.trim()).filter(Boolean)
        : [],
      price: req.body.price ? Number(req.body.price) : 0,
      isFree: !req.body.price || Number(req.body.price) === 0,
      isPublished: req.body.isPublished === "on",
      publishedAt: req.body.isPublished === "on" ? new Date() : null,
    };

    if (req.file && req.file.path) {
      await deleteCloudinaryImage(course.thumbnail);
      updateData.thumbnail = req.file.path;
    }

    await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.redirect("/admin/courses");

  } catch (error) {
    console.error("Course update error:", error);
    res.status(500).send("Update failed");
  }
}


  /* ============================
     DELETE COURSE
  ============================ */
  async delete(req, res) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.redirect("/admin/courses");
    }

    // 🔥 Delete thumbnail from Cloudinary
    if (course.thumbnail) {
      await deleteCloudinaryImage(course.thumbnail);
    }

    // 🗑️ Delete course from DB
    await Course.findByIdAndDelete(req.params.id);

    res.redirect("/admin/courses");

  } catch (error) {
    console.error("Course delete error:", error);
    res.status(500).send("Delete failed");
  }
 }
}

module.exports = new AdminCourseController();
