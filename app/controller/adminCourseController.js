const Course = require("../model/courseModel");
const User = require("../model/userModel");
const cloudinary = require('../helper/cloudinary');

class AdminCourseController {

  async index(req, res) {
    const courses = await Course.find().populate("teacher");
    res.render("admin/courses/index", { courses, admin: req.user });
  }

  async createForm(req, res) {
    const teachers = await User.find({ role: "teacher" });
    res.render("admin/courses/create", { teachers, admin: req.user });
  }

  async store(req, res) {

    console.log(req.file.path);
    //const img = await cloudinary.uploader.upload(req.file.path);
    //console.log(img);
     const course = new Course({
                        title: req.body.title,
                        shortDescription: req.body.shortDescription,
                        teacher: req.body.teacher,
                        thumbnail: req.file.path,
                        price: req.body.price,
                        level: req.body.level,
                        category: req.body.category
            });

    await course.save();
    
    res.redirect("/admin/courses");
  }

  async editForm(req, res) {
    const course = await Course.findById(req.params.id);
    const teachers = await User.find({ role: "teacher" });

    res.render("admin/courses/edit", { course, teachers, admin: req.user });
  }

  async update(req, res) {
    await Course.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/admin/courses");
  }

  async delete(req, res) {
    await Course.findByIdAndDelete(req.params.id);
    res.redirect("/admin/courses");
  }
}

module.exports = new AdminCourseController();
